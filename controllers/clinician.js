shared = require( './shared' ); 
pageSize = 3;

 module.exports = {
    getclinicianHomePage: (req, res) => {
        var search = '';
        if (req.query !== null && req.query.search)
            search = shared.safeString(req.query.search,256);

        let query = "SELECT * FROM `clinicians` ORDER BY id ASC";    
        if (search !== '')
            query = 'SELECT * FROM `clinicians` WHERE ' + shared.makeLikes({'first_name':search, 'last_name':search, 'email':search}) + ' ORDER BY id ASC'; 

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
            res.render('index-clinician.ejs', {
                title: config.welcome_message + ' | View clinicians',
                clinicians: dataList, 
                user:req.user, 
                pageSize: pageSize,
                totalRows: totalRows,
                pageCount: pageCount,
                currentPage: currentPage,
                search: search
            });
        });
    },
    addclinicianPage: (req, res) => {
        res.render('add-clinician.ejs', {
            title: config.welcome_message + ' | Add a new clinician'
            ,message: ''
        });
    },
    addclinician: (req, res) => {
        
        /*if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }*/

        let message = '';
        let first_name = shared.safeString(req.body.first_name);
        let last_name = shared.safeString(req.body.last_name);
        let email = shared.safeString(req.body.email); 
        let admin = shared.safeString(req.body.admin) ? 1 : 0;
        let configuration = shared.safeString(req.body.configuration); 
        //let uploadedFile = shared.safeString(req.files.image);
        //let image_name = shared.safeString(uploadedFile.name);
        //let fileExtension = uploadedFile.mimetype.split('/')[1];
        //image_name = email + '.' + fileExtension;
 
        let usernameQuery = "SELECT * FROM `clinicians` WHERE email = ?";

        db.query(usernameQuery, [email], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Email already exists';
                res.render('add-clinician.ejs', {
                    message,
                    title: config.welcome_message + ' | Add a new clinician'
                });
            } else {
                let query = "INSERT INTO `clinicians` (first_name, last_name, email, admin, configuration) VALUES (?, ?, ?, ?, ?)";
                db.query(query, [first_name, last_name, email, admin, configuration], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/clinician');
                });

                // check the filetype before uploading it
                /*if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                         
                        let query = "INSERT INTO `clinicians` (first_name, last_name, email, image, admin, configuration) VALUES (?, ?, ?, ?, ?, ?)";
                        db.query(query, [first_name, last_name, email, image, admin, configuration], (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/clinician');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-clinician.ejs', {
                        message,
                        title: config.welcome_message + ' | Add a new clinician'
                    });
                }*/
            }
        });
    },
    editclinicianPage: (req, res) => {
        let clinicianId = shared.safeString(req.params.id); 
        let query = "SELECT * FROM `clinicians` WHERE `id` = ? ";
        db.query(query,[clinicianId], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-clinician.ejs', {
                title: 'Edit clinician'
                ,clinician: result[0]
                ,message: ''
            });
        });
    },
    editclinician: (req, res) => {
        let clinicianId = shared.safeString(req.params.id);
        let first_name = shared.safeString(req.body.first_name);
        let last_name = shared.safeString(req.body.last_name);
        let email = shared.safeString(req.body.email);  
        let configuration = shared.safeString(req.body.configuration);  
        let admin = shared.safeString(req.body.admin) ? 1 : 0;

        let query = "UPDATE `clinicians` SET `first_name` = ?, `last_name` = ?, `admin` = ?, `email` = ?, `configuration` = ? WHERE `clinicians`.`id` = ?";
        db.query(query, [first_name, last_name, admin, email, configuration, clinicianId],(err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            //console.log(`query: ${query}`);
            res.redirect('/clinician');
        });
    },
    deleteclinician: (req, res) => {
        let clinicianId = shared.safeString(req.params.id); 
        let getActiveQuery = 'SELECT `active` from `clinicians` WHERE id = ?'; 
        let deactivateQuery = 'UPDATE `clinicians` set `active` = 0, `modified_at` = now() WHERE `active` = 1 and `id` = ?';
        let activateQuery = 'UPDATE `clinicians` set `active` = 1, `modified_at` = now() WHERE `active` = 0 and `id` = ?';

        db.query(getActiveQuery, [clinicianId], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            
            let active = result[0].active; 
            if (active == 1)
                db.query(deactivateQuery, [clinicianId], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    } 
                    //console.log(`deactivateQuery: ${deactivateQuery}`);
                    res.redirect('/clinician');
                }); 
            else
                db.query(activateQuery, [clinicianId], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    } 
                    //console.log(`activateQuery: ${activateQuery}`);
                    res.redirect('/clinician');
                }); 
        }); 
    }
};