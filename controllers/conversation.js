// let password = bcrypt.hashSync(req.body.password, pass_hash_rounds); 
// if(bcrypt.compareSync('somePassword', hash)) {} 

shared = require( './shared' );

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
        userID = shared.safeString(userID);
        last_question = shared.safeString(last_question);

        var admin = 0, participantId = 0;
        if (userID.search("clinician-") > -1 || userID.search("admin-") > -1){
            admin = 1; 
            participantId = userID.replace("clinician-", "").replace("admin-", ""); 
        } 
        else{
            participantId = userID.replace("participant-", "");  
        }   

        //let query = 'SELECT `id` from `conversations` WHERE last_question != "page-load" AND participant_id = "' + participantId + '" AND admin = "' + admin + '" ORDER BY created_at DESC'; 
        //let queryInsert = "INSERT INTO `conversations` (participant_id, last_question, admin, last_modified_at) VALUES ('" + participantId + "', '" + last_question + "', '" + admin + "', NOW())"; 
        let query = 'SELECT `id` from `conversations` WHERE last_question != "page-load" AND participant_id = ? AND admin = ? ORDER BY created_at DESC'; 
        let queryInsert = "INSERT INTO `conversations` (participant_id, last_question, admin, last_modified_at) VALUES (?, ?, ?, NOW())";   
        
        if (last_question === "start")
            db.query(queryInsert, [participantId, last_question, admin], (err, result) => {
                if (err) {
                    console.log(`conversations queryInsert error: ${err}`);
                }  
                else
                    console.log(`conversations queryInsert done: ${queryInsert}`); 
            });  

        else
            db.query(query, [participantId, admin], (err, result) => { 
                if (err) {
                    console.log(`conversations query error: ${err}`); 
                }  
                else{
                    console.log(`conversations query done: ${query}`); 
                    //et queryUpdate = 'UPDATE `conversations` set `last_question` = "' + last_question + '", `last_modified_at` = now() WHERE `id` = "' + result[0].id + '"';
                    let queryUpdate = 'UPDATE `conversations` set `last_question` = ?, `last_modified_at` = now() WHERE `id` = ?';
                 
                 
                    db.query(queryUpdate, [last_question, result[0].id], (err, result) => {
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
        let conversationId = shared.safeString(req.params.id);  
        //let query = "SELECT * FROM `conversations` WHERE `id` = '" + conversationId + "' ";
        let query = "SELECT * FROM `conversations` WHERE `id` = ? ";
        db.query(query, [conversationId], (err, result) => {
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