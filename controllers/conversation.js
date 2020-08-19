// let password = bcrypt.hashSync(req.body.password, pass_hash_rounds); 
// if(bcrypt.compareSync('somePassword', hash)) {} 

shared = require( './shared' );
pageSize = 10;

module.exports = {   
    getconversationHomePage: (req, res) => {
        let query = "SELECT * FROM `conversations` ORDER BY id ASC";  

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
            res.render('index-conversation.ejs', {
                title: config.welcome_message + ' | View participants',
                conversations: dataList, 
                user:req.user, 
                pageSize: pageSize,
                totalRows: totalRows,
                pageCount: pageCount,
                currentPage: currentPage
            });
        });
    },
    updateconversation: (id, last_question) => {    
        //let query = 'SELECT `id` from `conversations` WHERE last_question != "page-load" AND participant_id = "' + participantId + '" AND admin = "' + admin + '" ORDER BY created_at DESC'; 
        //let queryInsert = "INSERT INTO `conversations` (participant_id, last_question, admin, last_modified_at) VALUES ('" + participantId + "', '" + last_question + "', '" + admin + "', NOW())";  
        let queryInsert = "INSERT INTO `conversations` (id, last_question, last_modified_at) VALUES (?, ?, NOW())";   
        
        if (last_question === "start")
            db.query(queryInsert, [id, last_question], (err, result) => {
                if (err) {
                    console.log(`conversations queryInsert error: ${err}`);
                }  
                //else
                //    console.log(`conversations queryInsert done: ${queryInsert}`); 
            });  

        else{  
            //console.log(`conversations query done: ${query}`); 
            //et queryUpdate = 'UPDATE `conversations` set `last_question` = "' + last_question + '", `last_modified_at` = now() WHERE `id` = "' + result[0].id + '"';
            let queryUpdate = 'UPDATE `conversations` set `last_question` = ?, `last_modified_at` = now() WHERE `id` = ?'; 
         
            db.query(queryUpdate, [last_question, id], (err, result) => {
                if (err) {
                    console.log(`conversations queryUpdate error: ${err}`);  
                }   
                //else
                //    console.log(`conversations queryUpdate done: ${queryUpdate}`); 
            });   
        }  
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