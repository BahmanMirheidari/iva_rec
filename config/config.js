// config/config.js
iva3           = require( './iva3.js' );
ivamc1         = require( './ivamc1.js' );
ivastroke1     = require( './ivastroke1.js' );

const PORT     = 8081; 
const PORT2    = 8082;
const WEB_URI  = 'https://digital-doctor.shef.ac.uk:';

module.exports = {
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
	    'ffmpeg_path'      : '/usr/bin/ffmpeg'   //'/usr/bin/ffmpeg'    '/Applications/ffmpeg/bin/ffmpeg'
    },
    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
    'iva_default': 'ivamc1',
    'iva_configs':{
        'iva3' : iva3,
        'ivamc1' : ivamc1,
        'ivastroke1' : ivastroke1
    }    
}; 
