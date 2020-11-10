// let password = bcrypt.hashSync(req.body.password, pass_hash_rounds); 
// if(bcrypt.compareSync('somePassword', hash)) {} 
shared = require( './shared' );
var pageSize = 10;



module.exports = {
    getparticipantHomePage: (req, res) => {
        var search = '';
        if (req.query !== null && req.query.search)
            search = shared.safeString(req.query.search,256);

        let query = "SELECT * FROM `participants` ORDER BY id ASC";   
        if (search !== '')
            query = 'SELECT * FROM `participants` WHERE ' + shared.makeLikes({'first_name':search, 'last_name':search, 'diagnosis':search, 'user_name':search, 'email':search}) + ' ORDER BY id ASC';
        //console.log(`query: ${query}`);

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                console.log(`Error: ${err}`);
                return res.redirect('/');
            }
            var totalRows = result.length;
            var pageCount = Math.ceil(totalRows / pageSize);
            var currentPage = 1;
            var dataList = []; 
            var dataArrays = []; 
            //split list into groups
            while (result.length > 0) {
                dataArrays.push(result.splice(0, pageSize));
            }

            //set current page if specifed as get variable (eg: /?page=2)
            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }

            //show list of students from group
            dataList = dataArrays[+currentPage - 1];

            //console.log(`query: ${query}`);
            res.render('index-participant.ejs', {
                title: config.welcome_message + ' | View participants',
                user:req.user, 
                participants: dataList, 
                pageSize: pageSize,
                totalRows: totalRows,
                pageCount: pageCount,
                currentPage: currentPage,
                search:search
            });
        });
    },
    addparticipantPage: (req, res) => {
        res.render('add-participant.ejs', {
            title: config.welcome_message + ' | Add a new participant'
            ,message: ''
        });
    },
    addparticipant: (req, res) => { 
        let message = '';
        let first_name = shared.safeString(req.body.first_name);
        let last_name = shared.safeString(req.body.last_name);
        let male = shared.safeString(req.body.male) ? 1 : 0; 
        let dob = shared.safeString(req.body.dob);
        let diagnosis = shared.safeString(req.body.diagnosis);
        let comment = shared.safeString(req.body.comment,1024);
        let user_name = shared.safeString(req.body.user_name);
        let password = bcrypt.hashSync(shared.safeString(req.body.password), config.pass_hash_rounds);
        let email = shared.safeString(req.body.email); 
        let configuration = shared.safeString(req.body.configuration);   
        let usernameQuery = "SELECT * FROM `participants` WHERE user_name = ?";

        db.query(usernameQuery, [user_name], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-participant.ejs', {
                    message,
                    title: config.welcome_message + ' | Add a new participant'
                });
            } else {  
                    let query = "INSERT INTO `participants` (first_name, last_name, male, dob, diagnosis, comment, user_name, password, email, configuration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    //console.log(`query: ${query}`);
                    db.query(query,[first_name, last_name, male, dob, diagnosis, comment, user_name, password, email, configuration], (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/participant');
                    }); 
                } 
        });
    },
    ,
    uploadparticipantsPage: (req, res) => {
        res.render('upload-participant.ejs', {
            title: config.welcome_message + ' | Upload participants'
            ,message: ''
        });
    },
    uploadparticipants: (req, res) => { 
        
        let filename = req.body.filename; 
        var csvFile = filename[0].files[0];
        var ext = csv.val().split(".").pop().toLowerCase();

        if($.inArray(ext, ["csv"]) === -1){
            alert('upload csv');
            return false;
        }
        if(csvFile != undefined){
            reader = new FileReader();
            reader.onload = function(e){

                csvResult = e.target.result.split(/\r|\n|\r\n/);
                alert(csvResult);
            }
            reader.readAsText(csvFile);
        }
    },
    editparticipantPage: (req, res) => {
        let participantId = shared.safeString(req.params.id); 
        let query = "SELECT * FROM `participants` WHERE `id` = ? ";
        db.query(query, [participantId], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-participant.ejs', {
                title: 'Edit participant'
                ,participant: result[0]
                ,message: ''
            });
        });
    },
    editparticipant: (req, res) => {
        let participantId = shared.safeString(req.params.id);
        let first_name = shared.safeString(req.body.first_name);
        let last_name = shared.safeString(req.body.last_name);
        let male = shared.safeString(req.body.male) ? 1 : 0; 
        let dob = shared.safeString(req.body.dob);
        let diagnosis = shared.safeString(req.body.diagnosis);
        let configuration = shared.safeString(req.body.configuration)
        let comment = shared.safeString(req.body.comment, 1024);  
          
        let query = "UPDATE `participants` SET `first_name` = ?, `last_name` = ?, `male` = ?, `dob` = ?, `diagnosis` = ?, `comment` = ?, `configuration` = ? WHERE `participants`.`id` = ?";
        db.query(query,[first_name, last_name, male, dob, diagnosis, comment, configuration, participantId], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            //console.log(`query: ${query}`);
            res.redirect('/participant');
        });
    },
    editparticipantpassPage: (req, res) => {
        let participantId = shared.safeString(req.params.id); 

        let query = "SELECT * FROM `participants` WHERE `id` = ? ";
        db.query(query,[participantId], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-participant-pass.ejs', {
                title: 'Edit participant'
                ,participant: result[0]
                ,hidpass: result[0].password
                ,message: ''
            });
        });
    },
    editparticipantpass: (req, res) => {
        let participantId = shared.safeString(req.params.id);
        let user_name = shared.safeString(req.body.user_name);
        let password = bcrypt.hashSync(shared.safeString(req.body.password), config.pass_hash_rounds); 
        let hidpass = shared.safeString(req.body.hidpass);
        let email = shared.safeString(req.body.email);    
        if (hidpass === shared.safeString(req.body.password)){ 
            query = "UPDATE `participants` SET `user_name` = ?, `email` = ? WHERE `participants`.`id` = ?";
            names = [user_name, email, participantId]
        }
            
        else{ 
            query = "UPDATE `participants` SET `user_name` = ?, `password` = ?, `email` = ? WHERE `participants`.`id` = ?";
            names = [user_name, password, email, participantId] 
        }
            
        db.query(query, names, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            } 
            res.redirect('/participant');
        });
        
        
    },
    deleteparticipant: (req, res) => {
        let participantId = shared.safeString(req.params.id);  

        let getActiveQuery = 'SELECT `active` from `participants` WHERE id = ?'; 
        let deactivateQuery = 'UPDATE `participants` set `active` = 0, `modified_at` = now() WHERE `active` = 1 and `id` = ?';
        let activateQuery = 'UPDATE `participants` set `active` = 1, `modified_at` = now() WHERE `active` = 0 and `id` = ?';

        db.query(getActiveQuery, [participantId], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            
            let active = result[0].active;
            //console.log(`active: ${active}`);
            if (active == 1)
                db.query(deactivateQuery, [participantId],(err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    } 
                    //console.log(`deactivateQuery: ${deactivateQuery}`);
                    res.redirect('/participant');
                }); 
            else
                db.query(activateQuery, [participantId], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    } 
                    //console.log(`activateQuery: ${activateQuery}`);
                    res.redirect('/participant');
                }); 
        }); 
    }
};