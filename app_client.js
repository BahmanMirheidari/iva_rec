
var express          = require( 'express' )
  , app              = express()
  , server           = require( 'http' ).createServer( app ) 
  , passport         = require( 'passport' )
  , util             = require( 'util' )
  , fs               = require( 'fs' )
  , bcrypt           = require( 'bcrypt' )
  , bodyParser       = require( 'body-parser' )
  , cookieParser     = require( 'cookie-parser' )
  , session          = require( 'express-session' )  
  , mysql            = require( 'mysql' )
  , fileUpload       = require( 'express-fileupload' )
  , path             = require( 'path' ) 
  , WebSocketServer  = require( 'ws' ).Server 
  , ffmpeg           = require( 'ffmpeg' ) 
  , Mp4Convert       = require( 'mp4-convert' )
  , fluentffmpeg     = require( 'fluent-ffmpeg' )
  , GoogleStrategy   = require( './controllers/google_aouth2.js' ).Strategy //require( 'passport-google-oauth2' ).Strategy;
  , config           = require( './config/config.js' ) 
  , pass             = require( '/home/sa_ac1bm/upload_files/config.js' ); 

const { exec }       = require('child_process');
merge_command = "/home/sa_ac1bm/upload_files/upload.sh"

const {auth,getrole} = require( './controllers/authorise' ); 
const {getconversationHomePage, updateconversation, conversation_detailsPage} = require( './controllers/conversation' ); 
const {createLogger,format,transports} = require('winston');
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
  filename: `${logDir}/%DATE%-log-client.txt`,
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
const db = mysql.createConnection ({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

// connect to database
db.connect((err) => {
    if (err) {
        console.log('Database error:' + err );
        throw err;
    }
    console.log('Connected to database');
});

global.db = db;
global.config = config;
global.bcrypt = bcrypt;
global.fs = fs;
var file_names  = {};
 
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
    clientID:     config.google.client_id,
    clientSecret: config.google.client_sec,
    //NOTE :
    //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
    //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
    //then edit your /etc/hosts local file to point on your private IP. 
    //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
    //if you use it.
    callbackURL: (config.ssl) ? config.google.redirect_uri2 : 'http://localhost:' +String(config.port2)+'/callback',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// configure Express
app.set( 'port', config.port2);
app.set( 'views', __dirname + '/views');
app.set( 'view engine', 'ejs');
app.use( express.static(__dirname + '/views/conversation'));
app.use('/scripts', express.static(`${__dirname}/node_modules/`));
app.use( fileUpload()); // configure fileupload
app.use( cookieParser()); 
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({
	extended: true
}));

// global variables
app.use(function (req, res, next) {
   res.locals = {
     web_uri: (config.ssl) ? config.web_uri2 + '/' : 'http://localhost:' +String(config.port2)+'/',
     socket_uri: (config.ssl) ? 'wss://digital-doctor.shef.ac.uk:' +String(config.port2) : 'ws://localhost:' +String(config.port2) 
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
 } ));       
 
app.use( passport.initialize());
app.use( passport.session()); 

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: [
       'email', 'profile'] 
}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get( '/callback', 
    	passport.authenticate( 'google', { 
    		successRedirect: '/verifyrole',
    		failureRedirect: '/login'
}));

app.get('/verifyrole', getrole); 
app.post('/auth', auth);
app.get('/login', function(req, res){ 
  res.render('login.ejs', {
        title: config.welcome_message + ' | Conversation'
        ,message: ''
    }); 
}); 

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
}); 

app.get('/', function(req, res){
  res.render('index', { user: req.user , role: req.session.role });
});  

// routes for the app      
app.get('/conversation', ensureAuthenticated, (req, res) => {
    if (req.user === undefined)
      res.redirect('/login');
    else
      res.render('conversation.ejs', {
          title: config.welcome_message + ' | Conversation'
          ,message: '', user :req.user 
      }); 
});   
  

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || req.session.authorised) { return next(); }
  res.redirect('/login');
}
  
var https = ( config.ssl ) ? require('https') : require('http'); 
var httpsServer = ( config.ssl ) ? https.createServer({key: fs.readFileSync(config.paths.key_file_path, 'utf8'), cert: fs.readFileSync(config.paths.cert_file_path, 'utf8')}, app) : httpsServer = https.createServer(app);
 
//*********** listen to port ************** //
httpsServer.listen(config.port2);

( config.ssl ) ? logger.info('https server (' + ip_address + ') is running on port: ' + config.port2): logger.info('http server (' + ip_address + ') is running on port: ' + config.port2);
  
var wss = new WebSocketServer({
server: httpsServer
});

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    theBlob.type = 'audio/mp3';
    return theBlob;
}

function file_copy(f1, f2, remove){
  fs.copyFile(f1, f2, (err) => {
      if (err)  
        logger.error('An error occurred while copying '+ f1 + ' to' + f2 + ':' + err.message);
      else{
        logger.info('Copied '+ f1 + ' to' + f2);
        if (remove){
          fs.unlink(f1, function (err) {
          if (err)  
              logger.error('An error occurred while deleting: ' + f1 + ' - ' + err.message); 
          else 
              logger.info('File ' + f1 +' deleted!');
          });  
        } 
      } 
    }); 
}

// delete file names bigger than 100 mins
var deleteFimeNames = setInterval(function () {
  datenow = new Date(); 

  for(var token in file_names) {
    splits = token.split('-'); 

    date = new Date(splits[3],splits[4],splits[5],splits[6],splits[7],0);

    var diff = Math.abs(Math.round((datenow.getTime() - date.getTime()) / 60000)); 
    if (dif > 100)
      delete file_names[token];

  }   
}, 1000000);

function merge_files(token,extension,file_names){ 
  if (extension == 'mp4'){
    const ls = exec(merge_command + " " + __dirname + "/uploads/" + token , function (error, stdout, stderr) {
    if (error) {
      logger.error(error.stack);
      //logger.error('Error code: '+error.code);
      //logger.error('Signal received: '+error.signal);
      //callback('error');
    }
    else{
      //logger.info('Child Process STDOUT: '+stdout);
      //logger.info('Child Process STDERR: '+stderr);
      //callback('done');
      src  = __dirname + "/uploads/" + token;
      dst1 = __dirname + "/dane/" + token;
      dst2 = config.mount_dir  + token;

      fs.rename(src, dst1, function (err) {
        if (err) {
          logger.error('error in renaming: '+err);
        }
        else{
          logger.info('renamed to ' + dst1); 

          fs.copyFile(dst1 + "/Q1-12.mp3", dst2 + "/Q1-12.mp3", function (err) {
            if (err) {
              logger.error(err);
            } else {
              logger.info("copied " + dst2 + "/Q1-12.mp3");  
            }
          }); 

          fs.copyFile(dst1 + "/Q1-12.mp4", dst2 + "/Q1-12.mp4", function (err) {
            if (err) {
              logger.error(err);
            } else {
              logger.info("copied " + dst2 + "/Q1-12.mp4");  
            }
          }); 

        }
      });  
    } 
    });  
  } 
   
  
  return
    /*destination = __dirname + "/uploads/" + token + "." + extension;
    var mergedVideo = new fluentffmpeg(); 
    mergedVideo.setFfmpegPath(config.paths.ffmpeg_path);
 
    file_names[token].forEach(function(element) { 
      mergedVideo = mergedVideo.addInput(__dirname + "/uploads/" + token + "/"+element + "." + extension);
    }); 

    mergedVideo.mergeToFile(destination, __dirname + '/uploads/tmp/')
    .on('error', function(err) { 
        logger.error('Merging error ('+token+'):' + err.message); 
    })
    .on('end', function() {
        logger.info('Finished merging ('+token +'.' + extension +')' );
        if (extension == 'mp4'){
          splits = token.split("-");
          userID = splits[0] + '-' + splits[1];
          updateconversation(userID, token +'.' + extension);  
        } 
    });*/  
} 

function mount(callback){
  var command = 'echo ' + pass.SAMBA.pwd + ' | sudo -S mount -t cifs ' + pass.SAMBA.address + ' ' + pass.SAMBA.mnt + ' -o username=' + pass.SAMBA.username + ',password='+ pass.SAMBA.password + ',rw,file_mode=0750,dir_mode=0750,uid=' + pass.SAMBA.uid;
  //logger.info('Child Process command: '+command);
  const ls = exec(command, function (error, stdout, stderr) {
    if (error) {
      //logger.error(error.stack);
      //logger.error('Error code: '+error.code);
      //logger.error('Signal received: '+error.signal);
      callback('error');
    }
    else{
      //logger.info('Child Process STDOUT: '+stdout);
      //logger.info('Child Process STDERR: '+stderr);
      callback('done');
    } 
  });  
} 

function copy_mount(mnt,file_name,token,dest){
  if (! fs.existsSync(mnt + "/" + token)) {
    fs.mkdirSync(mnt + "/" + token); 
  }

  fs.copyFile(file_name, mnt + "/" + token + "/" + dest, function(err){
    if (!err){
      logger.info('copied ' + file_name + ' to ' + mnt + "/" + token); 
    }  
  });
}

function copy_to_mount(mnt,file_name,token,dest){
  if (!fs.existsSync(pass.SAMBA.destination)){
    mount(function(msg){
      if (msg == 'done'){
        copy_mount(mnt,file_name,token,dest);
      }
    });
  } 
  else
    copy_mount(mnt,file_name,token,dest);
}

wss.on('connection', function connection(ws) {
ws.on('message', function incoming(message) {
message = JSON.parse(message); 
  var received_ip = ws._socket.remoteAddress;
  var msg = message.msg;
  var data = message.data;  

  if ( msg != null ) {
    logger.info('received ip: ' + received_ip + ' - msg: ' + msg); 
    
  if (msg == 'token') {
      logger.info('token: ' + data);
      splits = data.split("-");
      userID = splits[0] + '-' + splits[1];
      updateconversation(userID, 'start');  

    } else if (msg == 'mp3' || msg == 'webm') {

	var token = data.token;
      var q_no = data.q_no; 
      var r_no = data.r_no; 

      splits = token.split("-");
      userID = splits[0] + '-' + splits[1]; 

      //if (r_no == 0 && q_no == config.last_q -1 )
      //  return

      //if (q_no == config.last_q)
      //  q_no--;

	var blob = data.data;
      var len  = blob.length; 
	var dest = 'Q'+ q_no.toString() + '-R' + r_no.toString();
	var file_name = __dirname + "/uploads/" + token + '/Q' + q_no.toString() + '-R' + r_no.toString();
      logger.info(msg + ' file: ' + file_name + "." + msg + ' - length: ' + len.toString());
      updateconversation(userID, msg + '-Q' + q_no.toString() + '-R' + r_no.toString() + '-L' + len.toString());

      //logger.info(util.inspect(blob, {showHidden: false, depth: null})) 
	if (!fs.existsSync(__dirname + "/uploads/" + token)) {
        fs.mkdirSync(__dirname + "/uploads/" + token);
      } 
      var max_file_size; 
      (msg == 'mp3') ? max_file_size = config.max_mp3_file : max_file_size = config.max_mp4_file;
 
      if (len < max_file_size && len > 200){ 
        //var base64Data = blob.replace(/^data:audio\/mp3;base64,/, "").replace(/^data:video\/webm;base64,/, "");  
          var base64Data = blob.split(';base64,').pop();
	  
        fs.writeFile(file_name + "." + msg, base64Data, 'base64', function(err) {
        if(err) {
                logger.error('error in saving ' + msg + ' file: ' + file_name + "." + msg+ " - " + err);
           } else {

           logger.info('saved ' + msg + ' file: ' + file_name + "." + msg);

           if (msg == 'webm'){
              if (file_names[token] === undefined) 
                file_names[token]=[]; 

              file_names[token].push('Q' + q_no.toString() + '-R' + r_no.toString());
              
              try {
                  var process = new ffmpeg(file_name + "." + msg);  
                  process.then(function (video) {
                  //convert to mp3
                  video.fnExtractSoundToMP3(file_name+ ".mp3", function (error, file) {
                  if (!error){
                    logger.info('converted to mp3 as ' + file_name + ".mp3" );
		      copy_to_mount(config.mount_dir,file_name + ".mp3",token,dest+".mp3");
		      if (q_no == config.last_q -1) 
                      merge_files(token,"mp3",file_names);
        
                    var convert = new Mp4Convert(file_name +'.webm', file_name +".mp4");
                    convert.on('done',function(){
			logger.info('converted to mp4 as ' + file_name + ".mp4" );
			copy_to_mount(config.mount_dir,file_name + ".mp4",token,dest+".mp4");
                       if (q_no == config.last_q -1) 
                          merge_files(token,"mp4",file_names);
                       fs.unlink(file_name + ".webm", function(err){
                          if (err){
                       logger.error('Deleting '+file_name + '.webm error: ' + err); 
                    }
                          else {
                                logger.info('Deleted ' + file_name + ".webm" );
                    }
                                   });
                
                    });
                    convert.start();
                   }  
                    else
                      logger.error('Error in converting to mp3: ' + error);  
                  }); 

                }, function (err) {
                    logger.error('FFMPEG MP3 error: ' + err); 
                  });
                } catch (e) {
                  logger.error('FFMPEG (MP3) CONVERSION msg: ' + e.msg);
                  logger.error('code: ' + e.code); 
                } 
              } 
           }
           
        });  
      } else {
        logger.warn('<BIG/VERY SMALL FILE> Sorry we cannot save the file: ' + file_name + '!!!');
      }
      
    } 
  }
}); 

// say welcome to the client
//ws.send('Hello from the IVA recording service ...');
});
