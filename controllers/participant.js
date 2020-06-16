// let password = bcrypt.hashSync(req.body.password, pass_hash_rounds); 
// if(bcrypt.compareSync('somePassword', hash)) {} 
shared = require( './shared' );

module.exports = {
    getparticipantHomePage: (req, res) => {
        let query = "SELECT * FROM `participants` ORDER BY id ASC";  

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                console.log(`Error: ${err}`);
                return res.redirect('/');
            }
            //console.log(`query: ${query}`);
            res.render('index-participant.ejs', {
                title: config.welcome_message + ' | View participants'
                ,participants: result, user:req.user, 
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
        let comments = shared.safeString(req.body.comments,200);
        let user_name = shared.safeString(req.body.user_name);
        let password = bcrypt.hashSync(shared.safeString(req.body.password), config.pass_hash_rounds);
        let email = shared.safeString(req.body.email);  

        //let usernameQuery = "SELECT * FROM `participants` WHERE user_name = '" + user_name + "'";
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
                    // send the participant's details to the database
                    //let query = "INSERT INTO `participants` (first_name, last_name, male, dob, diagnosis, comments, user_name, password, email) VALUES ('" +
                    //    first_name + "', '" + last_name + "', '" + male + "', '" + dob + "', '" + diagnosis + "', '" + comments + "', '" + user_name + "', '" + password + "', '" + email + "')";
                    let query = "INSERT INTO `participants` (first_name, last_name, male, dob, diagnosis, comments, user_name, password, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    //console.log(`query: ${query}`);
                    db.query(query,[first_name, last_name, male, dob, diagnosis, comments, user_name, password, email], (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/participant');
                    }); 
                } 
        });
    },
    editparticipantPage: (req, res) => {
        let participantId = shared.safeString(req.params.id);
        //let query = "SELECT * FROM `participants` WHERE `id` = '" + participantId + "' ";
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
        let comments = shared.safeString(req.body.comments, 200);  
        //let query = "UPDATE `participants` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `male` = '" + male + "', `dob` = '" + dob + "', `diagnosis` = '" + diagnosis + "', `comments` = '" + comments + "' WHERE `participants`.`id` = '" + participantId + "'";
        
        let query = "UPDATE `participants` SET `first_name` = ?, `last_name` = ?, `male` = ?, `dob` = ?, `diagnosis` = ?, `comments` = ? WHERE `participants`.`id` = ?";
        db.query(query,[first_name, last_name, male, dob, diagnosis, comments, participantId], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            //console.log(`query: ${query}`);
            res.redirect('/participant');
        });
    },
    editparticipantpassPage: (req, res) => {
        let participantId = shared.safeString(req.params.id);
        //let query = "SELECT * FROM `participants` WHERE `id` = '" + participantId + "' ";
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
            //query = "UPDATE `participants` SET `user_name` = '" + user_name + "', `email` = '" + email + "' WHERE `participants`.`id` = '" + participantId + "'";
            query = "UPDATE `participants` SET `user_name` = ?, `email` = ? WHERE `participants`.`id` = ?";
            names = [user_name, email, participantId]
        }
            
        else{
            //query = "UPDATE `participants` SET `user_name` = '" + user_name + "', `password` = '" + password  + "', `email` = '" + email + "' WHERE `participants`.`id` = '" + participantId + "'";
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
        //let getActiveQuery = 'SELECT `active` from `participants` WHERE id = "' + participantId + '"'; 
        //let deactivateQuery = 'UPDATE `participants` set `active` = 0, `modified_at` = now() WHERE `active` = 1 and `id` = "' + participantId + '"';
        //let activateQuery = 'UPDATE `participants` set `active` = 1, `modified_at` = now() WHERE `active` = 0 and `id` = "' + participantId + '"';
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