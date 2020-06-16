// let password = bcrypt.hashSync(req.body.password, pass_hash_rounds); 
// if(bcrypt.compareSync('somePassword', hash)) {} 

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
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let male = req.body.male ? 1 : 0; 
        let dob = req.body.dob;
        let diagnosis = req.body.diagnosis;
        let comments = req.body.comments;
        let user_name = req.body.user_name;
        let password = bcrypt.hashSync(req.body.password, config.pass_hash_rounds);
        let email = req.body.email;  

        let usernameQuery = "SELECT * FROM `participants` WHERE user_name = '" + user_name + "'";

        db.query(usernameQuery, (err, result) => {
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
                    let query = "INSERT INTO `participants` (first_name, last_name, male, dob, diagnosis, comments, user_name, password, email) VALUES ('" +
                        first_name + "', '" + last_name + "', '" + male + "', '" + dob + "', '" + diagnosis + "', '" + comments + "', '" + user_name + "', '" + password + "', '" + email + "')";
                    //console.log(`query: ${query}`);
                    db.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/participant');
                    }); 
                } 
        });
    },
    editparticipantPage: (req, res) => {
        let participantId = req.params.id;
        let query = "SELECT * FROM `participants` WHERE `id` = '" + participantId + "' ";
        db.query(query, (err, result) => {
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
        let participantId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let male = req.body.male ? 1 : 0; 
        let dob = req.body.dob;
        let diagnosis = req.body.diagnosis;
        let comments = req.body.comments;  

        let query = "UPDATE `participants` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `male` = '" + male + "', `dob` = '" + dob + "', `diagnosis` = '" + diagnosis + "', `comments` = '" + comments + "' WHERE `participants`.`id` = '" + participantId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            //console.log(`query: ${query}`);
            res.redirect('/participant');
        });
    },
    editparticipantpassPage: (req, res) => {
        let participantId = req.params.id;
        let query = "SELECT * FROM `participants` WHERE `id` = '" + participantId + "' ";
        db.query(query, (err, result) => {
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
        let participantId = req.params.id;
        let user_name = req.body.user_name;
        let password = bcrypt.hashSync(req.body.password, config.pass_hash_rounds); 
        let hidpass = req.body.hidpass;
        let email = req.body.email;    
        if (hidpass === req.body.password)
            query = "UPDATE `participants` SET `user_name` = '" + user_name + "', `email` = '" + email + "' WHERE `participants`.`id` = '" + participantId + "'";
        else
            query = "UPDATE `participants` SET `user_name` = '" + user_name + "', `password` = '" + password  + "', `email` = '" + email + "' WHERE `participants`.`id` = '" + participantId + "'";
        
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            } 
            res.redirect('/participant');
        });
    },
    deleteparticipant: (req, res) => {
        let participantId = req.params.id; 
        let getActiveQuery = 'SELECT `active` from `participants` WHERE id = "' + participantId + '"'; 
        let deactivateQuery = 'UPDATE `participants` set `active` = 0, `modified_at` = now() WHERE `active` = 1 and `id` = "' + participantId + '"';
        let activateQuery = 'UPDATE `participants` set `active` = 1, `modified_at` = now() WHERE `active` = 0 and `id` = "' + participantId + '"';

        db.query(getActiveQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            
            let active = result[0].active;
            //console.log(`active: ${active}`);
            if (active == 1)
                db.query(deactivateQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    } 
                    //console.log(`deactivateQuery: ${deactivateQuery}`);
                    res.redirect('/participant');
                }); 
            else
                db.query(activateQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    } 
                    //console.log(`activateQuery: ${activateQuery}`);
                    res.redirect('/participant');
                }); 
        }); 
    }
};