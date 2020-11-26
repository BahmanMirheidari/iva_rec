//https://beautifier.io/

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    passport = require('passport'),
    util = require('util'),
    fs = require('fs'),
    bcrypt = require('bcrypt'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mysql = require('mysql'),
    fileUpload = require('express-fileupload'),
    path = require('path'),
    WebSocketServer = require('ws').Server,
    ffmpeg = require('ffmpeg'),
    Mp4Convert = require('mp4-convert'),
    fluentffmpeg = require('fluent-ffmpeg'),
    GoogleStrategy = require('./controllers/google_aouth2.js').Strategy, //require( 'passport-google-oauth2' ).Strategy; 
    config = require('./config/config.js'),
    common = require('./config/common.js');

/* change 18/6/20*/
const {
    auth,
    auth2,
    getrole
} = require('./controllers/authorise_user');
const {
    getclinicianHomePage,
    addclinicianPage,
    addclinician,
    editclinicianPage,
    editclinician,
    deleteclinician
} = require('./controllers/clinician');
const {
    getparticipantHomePage,
    addparticipantPage,
    addparticipant,
    uploadparticipantsPage,
    uploadparticipants,
    editparticipantPage,
    editparticipant,
    editparticipantpassPage,
    editparticipantpass,
    deleteparticipant
} = require('./controllers/participant');
const {
    getconversationHomePage,
    updateconversation, 
    conversation_detailsPage
} = require('./controllers/conversation');
const {
    createLogger,
    format,
    transports
} = require('winston');
require('winston-daily-rotate-file');
const watermark_image_path = __dirname + '/views/conversation/images/iva.png';
const env = process.env.NODE_ENV || 'development';
const logDir = __dirname + '/log';

function getIPAddresses() {
    var ipAddresses = [];
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                ipAddresses.push(alias.address);
            }
        }
    }
    return ipAddresses;
}

ip_address = getIPAddresses();

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-log.txt`,
    datePattern: 'YYYY-MM-DD'
});

const logger = createLogger({
    // change level if in dev environment versus production
    level: env === 'development' ? 'verbose' : 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        dailyRotateFileTransport
    ]
});

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

// connect to database
db.connect((err) => {
    if (err) {
        console.log('Database error:' + err);
        throw err;
    }
    console.log('Connected to database');
});

global.db = db;
global.config = config;
global.bcrypt = bcrypt;
global.fs = fs;
global.logger = logger;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// https://github.com/mstade/passport-google-oauth2/tree/8541666b9c5b51f0da13e9776f9989eceabc79b5
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
        clientID: config.google.client_id,
        clientSecret: config.google.client_sec,
        //NOTE :
        //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
        //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
        //then edit your /etc/hosts local file to point on your private IP. 
        //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
        //if you use it.
        callbackURL: (config.ssl) ? config.google.redirect_uri : 'http://localhost:' + String(config.port) + '/callback',
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {

            // To keep the example simple, the user's Google profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Google account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

// configure Express
app.set('port', config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/conversation'));
app.use('/scripts', express.static(`${__dirname}/node_modules/`));
app.use(fileUpload({
    createParentPath: true
})); // configure fileupload
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// global variables
app.use(function(req, res, next) {
    res.locals = {
        web_uri: (config.ssl) ? config.web_uri + '/' : 'http://localhost:' + String(config.port) + '/',
        socket_uri: (config.ssl) ? 'wss://digital-doctor.shef.ac.uk:' + String(config.port) : 'ws://localhost:' + String(config.port)
    };
    next();
});

app.use(session({
    secret: config.cookie_secret,
    cookie: {
        httpOnly: true,
        secure: true
    },
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', {
    scope: [
        'email', 'profile'
    ]
}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/callback',
    passport.authenticate('google', {
        successRedirect: '/verifyrole',
        failureRedirect: '/login'
    }));

app.get('/verifyrole', getrole);
app.post('/auth', auth2);
app.get('/login', function(req, res) {
    res.render('login2.ejs', {
        title: config.welcome_message + ' | Conversation',
        message: ''
    });
});

app.get('/logout', function(req, res) {
    req.user = null;
    req.session.destroy();
    req.logout();
    res.redirect('/');
});

app.get('/', function(req, res) {
    res.render('index', {
        user: req.user,
        role: req.session.role
    });
});

// routes for the app  
app.get('/clinician', ensureIsAdmin, getclinicianHomePage);
app.get('/addclinician', ensureIsAdmin, addclinicianPage);
app.get('/editclinician/:id', ensureIsAdmin, editclinicianPage);

app.get('/deleteclinician/:id', ensureIsAdmin, deleteclinician);
app.post('/addclinician', ensureIsAdmin, addclinician);
app.post('/editclinician/:id', ensureIsAdmin, editclinician);

app.get('/participant', ensureIsClinician, getparticipantHomePage);
app.get('/addparticipant', ensureIsClinician, addparticipantPage);
app.get('/uploadparticipants', ensureIsClinician, uploadparticipantsPage);
app.get('/editparticipant/:id', ensureIsClinician, editparticipantPage);
app.get('/editparticipantpass/:id', ensureIsClinician, editparticipantpassPage);

app.get('/deleteparticipant/:id', ensureIsClinician, deleteparticipant);
app.post('/addparticipant', ensureIsClinician, addparticipant);
app.post('/uploadparticipants', ensureIsClinician, uploadparticipants);
app.post('/editparticipant/:id', ensureIsClinician, editparticipant);
app.post('/editparticipantpass/:id', ensureIsClinician, editparticipantpass);

app.get('/conversations', ensureIsClinician, getconversationHomePage);
app.get('/conversation_details/:id', ensureIsClinician, conversation_detailsPage);

/* change 18/6/20*/
app.get('/conversation', ensureAuthenticated, (req, res) => {
    if (req.user === undefined)
        res.redirect('/login');
    else
        res.render('talk2iva_modified.ejs', {
            title: config.welcome_message + ' | Conversation',
            message: '',
            user: req.user
        });
});

/*
app.get('/conversation_modified', ensureAuthenticated, (req, res) => {
    if (req.user === undefined)
        res.redirect('/login');
    else
        res.render('talk2iva_modified.ejs', {
            title: config.welcome_message + ' | Conversation',
            message: '',
            user: req.user
        });
});

app.get('/getvideo/:id', ensureIsClinician, (req, res) => {
    let movieFile = __dirname + "/uploads/" + req.params.id;
    logger.info('/getvideo/ ' + movieFile);
    const stat = fs.statSync(movieFile)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ?
            parseInt(parts[1], 10) :
            fileSize - 1

        const chunksize = (end - start) + 1
        const file = fs.createReadStream(movieFile, {
            start,
            end
        })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(movieFile).pipe(res)
    }
});*/

function ensureIsAdmin(req, res, next) {
    if (req.isAuthenticated() && req.session.authorised && req.session.role === 'admin') {
        return next();
    }
    res.redirect('/participant');
}

function ensureIsClinician(req, res, next) {
    if (req.isAuthenticated() && req.session.authorised && (req.session.role === 'clinician' || req.session.role === 'admin')) {
        return next();
    }
    res.redirect('/conversation');
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() || req.session.authorised) {
        return next();
    }
    res.redirect('/login');
}

var https = (config.ssl) ? require('https') : require('http');
var httpsServer = (config.ssl) ? https.createServer({
    key: fs.readFileSync(config.paths.key_file_path, 'utf8'),
    cert: fs.readFileSync(config.paths.cert_file_path, 'utf8')
}, app) : httpsServer = https.createServer(app);

//*********** listen to port ************** //
httpsServer.listen(config.port);

(config.ssl) ? logger.info('https server (' + ip_address + ') is running on port: ' + config.port): logger.info('http server (' + ip_address + ') is running on port: ' + config.port);

var wss = new WebSocketServer({
    server: httpsServer
});  

function process_video_audio(mnt, logger,updateconversation, data, dirname, max_webm_size=500000000){
  var token = data.token; 
  var blob = data.data; 
  var sub_folder = dirname + "/uploads/" + token;
  var ext = data.ext;
  var dest = 'video_audio-' + 'recording' + data.count.toString() +'.' + ext;
  var file_name = sub_folder + '/' + dest;
  var can_save = false; 
  common.mkdir(sub_folder);
 
  if (!fs.existsSync(file_name)) {
    can_save = true;  
    logger.info('received file: ' + file_name);
  }
  else{
    const stat = fs.statSync(file_name);  
    if (stat.size/max_webm_size <= 1)
      can_save = true; 
  } 

  if (can_save){

    /*const fileStream = fs.createWriteStream(file_name, {
        flags: 'a'
    });

    fileStream.write(new Buffer(blob.split(';base64,').pop(), 'base64')); */
    const fileStream = fs.createWriteStream(file_name);
    fileStream.write(new Buffer(blob.split(';base64,').pop(), 'base64'));

    common.copy_to_mount(mnt, file_name, token, dest); 
  } 
}
 

wss.on('connection', function connection(ws) {  
    ws.on('message', function incoming(message) {
        try {
            message = JSON.parse(message);
            //var received_ip = ws._socket.remoteAddress;  //ws._socket.remoteAddress;
            var msg = message.msg;
            var data = message.data;  
            var osBrStr = message.browser;
    
            if (msg != null) {
                logger.info(' msg: ' + msg );

                //logger.info(util.inspect(blob, {showHidden: false, depth: null}))  
                if (data.token !== undefined)
                    common.mkdir(__dirname + "/uploads/" + data.token);

                /* changed 23/6/20 */
                if (msg == 'consent') {
                    common.process_content(data, __dirname, config.mount_dir);
                }
                else if (msg == 'survey'){
                    common.process_survey(data, __dirname, config.mount_dir);
                }
                else if (msg == 'segment'){
                    common.process_segment(config.mount_dir, logger,updateconversation, data, __dirname);
                }
                else if (msg == 'video-audio'){
                    process_video_audio(config.mount_dir, logger,updateconversation,data, __dirname,500000000); 
                }
                else if (msg == 'video'){
                    common.process_webmvideoaudio(config.mount_dir, logger,updateconversation,data, __dirname,'video',500000000); 
                }
                else if (msg == 'audio'){
                    common.process_webmvideoaudio(config.mount_dir, logger,updateconversation,data, __dirname,'audio',60000000); 
                }
                else if (msg == 'token')  {
                    common.process_token(config.mount_dir, logger,updateconversation,data, __dirname, osBrStr);
                } 
                else if (msg == 'error')  {
                    common.process_error(config.mount_dir, logger,updateconversation,data, __dirname);
                } 
                else if (msg == 'webm-audio-chunk')  {
                    common.process_chuncks(config.mount_dir, logger,updateconversation,data, __dirname, audio = true);  
                }
                else if (msg == 'webm-video-chunk')  {
                    common.process_chuncks(config.mount_dir, logger,updateconversation,data, __dirname, audio = false);  
                }
                else if (msg == 'mp3' || msg == 'webm' || msg == 'webm-audio' || msg == 'webm-video') { 
                    common.process_mp3mp4(msg, config.mount_dir, logger,updateconversation,data, __dirname, config.max_mp3_file,config.max_mp4_file,config.last_q); 
                }
            }

        } catch (e) { 
            logger.error('incoming(message)-Error: ' + e); 
        }
    });

    // say welcome to the client
    //ws.send('Hello from the IVA recording service ...');
});