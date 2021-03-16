// config/config.js
ivamem1        = require( './ivamem1.js' );
ivamem2        = require( './ivamem2.js' );
ivamem3        = require( './ivamem3.js' );
ivamem4        = require( './ivamem4.js' );
ivamem5        = require( './ivamem5.js' );
ivamem6        = require( './ivamem6.js' );
ivamem7        = require( './ivamem7.js' );
ivastroke1     = require( './ivastroke1.js' );
ivastroke2     = require( './ivastroke2.js' );
ivastroke_test = require( './ivastroke_test.js' );

const PORT     = 8081; 
const PORT2    = 8082;
const WEB_URI  = 'https://digital-doctor.shef.ac.uk:';

module.exports = {
    'email':{
        'from':     'server@cognospeak.shef.ac.uk',
        'to':       'b.mirheidari@sheffield.ac.uk',
        'subject':  'New call on CognoSpeak',
        'text':     'A user accessed the website ' + WEB_URI + '. DateTime: <DATETIME>, Token: <TOKEN>, OS/BR: <OS>' 
    },
    
    'welcome_message'      : 'Welcome to Digital-Doctor',
    'mount_dir'            : '/home/sa_ac1bm/mnt/Blackburn/Avatar/CognoSpeak',
    'pass_hash_rounds'     : 10,
    'ssl'                  : true,
    'port'                 : PORT,
    'port2'                : PORT2,
    'web_uri'              : WEB_URI + String(PORT),
    'web_uri2'             : WEB_URI + String(PORT2),
 
    'last_q'               : 13,
    'cookie_secret'        : '6fXSGsre&£57fdjst%6w3hcxsxhg1s012',

    'max_mp3_file'         : 9000000,
    'max_mp4_file'         : 90000000,

    'google': { 
	'client_id'            : '709036451864-tppf34n7kc4i7a22r1gikrvpgvqg0qjt.apps.googleusercontent.com',
	'client_sec'           : 'wm5YyU8NvxvWIoeekJYiM8r2',
	'redirect_uri'         : WEB_URI + String(PORT) + '/callback',
    'redirect_uri2'        : WEB_URI + String(PORT2) + '/callback'
    },

    'mysql': {
        'host': '127.0.0.1',
        'user': 'root',
        'password': 'uPhe1foh',
        'database': 'dig_doc'
    },
    
    'paths': { 
        'cert_file_path'   : '/etc/pki/tls/certs/digital-doctor_shef_ac_uk.crt', 
        'key_file_path'    : '/etc/pki/tls/private/digital-doctor.key',
        'ca_file_path'    : '/etc/pki/tls/certs/QuoVadisOVIntermediateCertificate.crt',
	    'ffmpeg_path'      : '/usr/bin/ffmpeg'   //'/usr/bin/ffmpeg'    '/Applications/ffmpeg/bin/ffmpeg'
    },
    'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js', 
    'iva_configs':{ 
        'ivamem1' : ivamem1,
        'ivamem2' : ivamem2,
        'ivamem3' : ivamem3,
        'ivamem4' : ivamem4,
        'ivamem5' : ivamem5,
        'ivamem6' : ivamem6,
        'ivamem7' : ivamem7, 
        'ivastroke1' : ivastroke1, 
        'ivastroke2' : ivastroke2,
        'ivastroketest' : ivastroke_test
    }    
}; 
