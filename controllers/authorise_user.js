// let password = bcrypt.hashSync(req.body.password, config.pass_hash_rounds); 
// if(bcrypt.compareSync('somePassword', hash)) {} 

shared = require( './shared' );

module.exports = {
    auth: (req, res) => {
    try{  
        
        //let password = bcrypt.hashSync(req.body.password, config.pass_hash_rounds);
        let username = shared.safeString(req.body.username); 
        //let query = "SELECT id,password FROM `participants` WHERE `active` = 1 AND ( `user_name` = '" + username + "' OR `email` = '" + username+ "' )"; 
        let query = "SELECT id,password,configuration FROM `participants` WHERE `active` = 1 AND ( `user_name` = ? OR `email` = ? )"; 
        // execute query
        db.query(query,[username, username], (err, result) => { 
          try{  
              v = bcrypt.compareSync(req.body.password, result[0].password); 
              if(v) {
                req.session.role = 'user'; 
                req.session.authorised = true;  
                req.user = {role:'user', 
                  userID: 'user-' + result[0].id, 
                  configuration: {
                    'consent':JSON.stringify(config.iva_configs[result[0].configuration].consent), 
                    'questions': JSON.stringify(config.iva_configs[result[0].configuration].questions), 
                    'surveys':JSON.stringify(config.iva_configs[result[0].configuration].surveys) } 
                  };  
                res.render('talk2iva.ejs', {
                    title: 'Conversation'
                        ,user: req.user
                        ,message: ''
                    });
              } 
              else{
                //res.redirect('/logout');
                res.render('login', { message: 'Invalid username/password!' });
              }
          } 
          catch(err){
            //res.redirect('/logout');
            res.render('login', { message: 'Invalid username/password!' });
          }  
        }); 
      }
      catch(err){
        //res.redirect('/logout');
        res.render('error', { message: err });
      }  
    },
    getrole: (req, res) => {
    try{ 
        let query = "SELECT id,admin FROM `clinicians` WHERE `active` = 1 AND `email` = ? "; 
        //let query = "SELECT id,admin FROM `clinicians` WHERE `active` = 1 AND `email` = '" + req.user.email + "' ";  
        req.session.role = '';
        req.session.authorised = false;  
        req.user.role = '';

        // execute query
        db.query(query, [shared.safeString(req.user.email)], (err, result) => { 
            try{
                req.session.authorised = true;  
                req.user.configuration = {
                  'consent':JSON.stringify(config.iva_configs[config.iva_default].consent), 
                  'questions': JSON.stringify(config.iva_configs[config.iva_default].questions), 
                  'surveys':JSON.stringify(config.iva_configs[config.iva_default].surveys) };

                if (result[0].admin === 1){
                  req.session.role = 'admin';
                  req.user.role = 'admin';
                  req.user.userID = 'admin-' + result[0].id;  

                  res.redirect('/clinician'); 
                }
                else {
                  req.session.role = 'clinician';
                  req.user.role = 'clinician';
                  req.user.userID = 'clinician-' + result[0].id; 
                  
                  res.redirect('/participant');
                }  
            }
            catch(err){ 
                //let query = "SELECT id FROM `participants` WHERE `active` = 1 AND `email` = '" + req.user.email + "' "; 
                let query = "SELECT id,configuration FROM `participants` WHERE `active` = 1 AND `email` = ? "; 
                req.session.role = '';
                req.session.authorised = false;  
                req.user.role = '';
                req.user.configuration = {
                  'consent':JSON.stringify(config.iva_configs[config.iva_default].consent), 
                  'questions': JSON.stringify(config.iva_configs[config.iva_default].questions), 
                  'surveys':JSON.stringify(config.iva_configs[config.iva_default].surveys)};

                // execute query
                db.query(query, [shared.safeString(req.user.email)], (err, result) => { 
                    try{
                        req.session.authorised = true;   
                        req.session.role = 'user';
                        req.user.role = 'user';
                        req.user.userID = 'participant-' + result[0].id; 
                        req.user.configuration = {
                          'consent':JSON.stringify(config.iva_configs[result[0].configuration].consent), 
                          'questions': JSON.stringify(config.iva_configs[result[0].configuration].questions), 
                          'surveys':JSON.stringify(config.iva_configs[result[0].configuration].surveys) }; 
                          
                        res.redirect('/conversation'); 
                    }
                    catch(err){ 
                        res.render('login', { message: 'Cannot perform oAUTH using email:' + shared.safeString(req.user.email) });

                    }
                }); 
            }
        }); 
      }
      catch(err){
        //res.redirect('/logout');
        res.render('error', { message: err });
      }  
    } 
};