// let password = bcrypt.hashSync(req.body.password, pass_hash_rounds); 
// if(bcrypt.compareSync('somePassword', hash)) {} 
shared = require( './shared' );
var pageSize = 10;

function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
   }  

function guid(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();  
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();  
    var dateTime = date+'-'+time;
    return date+'-'+time + '-' +(S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
} 

function insert(res, first_name, last_name, male, dob, diagnosis, comment, user_name, password, email, configuration, use_res){
    let usernameQuery = "SELECT * FROM `participants` WHERE user_name = ?";

    db.query(usernameQuery, [user_name], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length > 0) {

            message = 'Username already exists';
            if (use_res == true)
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
                    if (use_res == true)
                        res.redirect('/participant');
                }); 
            } 
    });
}

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
        insert(res, first_name, last_name, male, dob, diagnosis, comment, user_name, password, email, configuration, true); 
    }, 
    uploadparticipantsPage: (req, res) => {
        res.render('upload-participants.ejs', {
            title: config.welcome_message + ' | Upload participants'
            ,message: ''
        });
    },
    uploadparticipants: (req, res) => {  
        try {
            if(!req.files) {
                res.send({
                    status: false,
                    message: 'Error: No file uploaded'
                });
                message = 'Cannot read csv file';
                res.render('upload-participants.ejs', {
                    message,
                    title: config.welcome_message + ' | Upload participants'
                });

            } else {
                let uploadedFile = req.files.filename;

                console.log(uploadedFile.name);
                var g = guid();

                console.log(g);

                var newname = 'tmp/' + g + '-' + uploadedFile.name;
                uploadedFile.mv(newname, function(err) {
                    if (err) {
                      res.send(err);
                    } else {
                        // read contents of the file
                        const data = fs.readFileSync(newname, 'UTF-8');

                        // split the contents by new line
                        const lines = data.split(/\r?\n/);

                        var added = 0

                        // print all lines
                        lines.forEach((line) => {
                            //console.log(line);
                            var ss = line.split(",");
                            var parid = ss[0];
                            var pass = ss[1];
                            var uniqueid=ss[2];
                            var cm=ss[3];
                            var cnf=ss[4]; 

                            let first_name = shared.safeString(parid);
                            let last_name = shared.safeString(parid);
                            let male = 0; 
                            let dob = "2000-01-01";
                            let diagnosis = shared.safeString(uniqueid);
                            let comment = shared.safeString(cm);
                            let user_name = shared.safeString(parid);
                            let password = bcrypt.hashSync(shared.safeString(pass), config.pass_hash_rounds);
                            let email = shared.safeString(parid) + "@sheffield.ac.uk"; 
                            let configuration = shared.safeString(cnf);   
                            insert(res, first_name, last_name, male, dob, diagnosis, comment, user_name, password, email, configuration, false); 
                            added ++; 
                        });

                        message = 'Csv file uploaded lines: ' + added.toString() ;
                        res.render('upload-participants.ejs', {
                            message,
                            title: config.welcome_message + ' | Upload participants'
                        }); 
                    }
                });  
            }
        } catch (err) { 

            message = 'Error while uploading file:' + err;
            res.render('upload-participants.ejs', {
                message,
                title: config.welcome_message + ' | Upload participants'
            });
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