// let password = bcrypt.hashSync(req.body.password, pass_hash_rounds); 
// if(bcrypt.compareSync('somePassword', hash)) {} 

module.exports = {   
    getconversationHomePage: (req, res) => {
        let query = "SELECT * FROM `conversations` ORDER BY id ASC";  

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                console.log(`Error: ${err}`);
                return res.redirect('/');
            }
            //console.log(`query: ${query}`);
            res.render('index-conversation.ejs', {
                title: config.welcome_message + ' | View participants'
                ,conversations: result, user:req.user
            });
        });
    },
    updateconversation: (userID, last_question) => {    
        var admin = 0, participantId = 0;
        if (userID.search("clinician-") > -1 || userID.search("admin-") > -1){
            admin = 1; 
            participantId = userID.replace("clinician-", "").replace("admin-", ""); 
        } 
        else{
            participantId = userID.replace("participant-", "");  
        }   

        let query = 'SELECT `id` from `conversations` WHERE last_question != "page-load" AND participant_id = "' + participantId + '" AND admin = "' + admin + '" ORDER BY created_at DESC'; 
        let queryInsert = "INSERT INTO `conversations` (participant_id, last_question, admin, last_modified_at) VALUES ('" + participantId + "', '" + last_question + "', '" + admin + "', NOW())";  
        
        if (last_question === "start")
            db.query(queryInsert, (err, result) => {
                if (err) {
                    console.log(`conversations queryInsert error: ${err}`);
                }  
                else
                    console.log(`conversations queryInsert done: ${queryInsert}`); 
            });  

        else
            db.query(query, (err, result) => { 
                if (err) {
                    console.log(`conversations query error: ${err}`); 
                }  
                else{
                    console.log(`conversations query done: ${query}`); 
                    let queryUpdate = 'UPDATE `conversations` set `last_question` = "' + last_question + '", `last_modified_at` = now() WHERE `id` = "' + result[0].id + '"';
                 
                    db.query(queryUpdate, (err, result) => {
                        if (err) {
                            console.log(`conversations queryUpdate error: ${err}`);  
                        }   
                        else
                            console.log(`conversations queryUpdate done: ${queryUpdate}`); 
                    });   
                } 
            }); 
    }, 
    conversation_detailsPage: (req, res) => {
        let conversationId = req.params.id;  
        let query = "SELECT * FROM `conversations` WHERE `id` = '" + conversationId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('conversation-details.ejs', {
                title: 'Conversation details'
                ,conversation: result[0]
                ,message: ''
            });
        });
    } 
};