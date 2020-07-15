fs             = require( 'fs' );
pass           = require( '/home/sa_ac1bm/upload_files/config.js' ); 

const { exec } = require('child_process');
merge_command  = "/home/sa_ac1bm/upload_files/upload.sh";
  
function merge_files(dirname,token,extension){ 
  if (extension == 'mp4'){
    const ls = exec(merge_command + " " + dirname + "/uploads/" + token , function (error, stdout, stderr) {
    if (error) {
      logger.error(error.stack); 
    }
    else{ 
      src  = dirname + "/uploads/" + token;
      dst1 = dirname + "/dane/" + token;
      dst2 = config.mount_dir  + "/"+ token;

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
 

module.exports = { 
    merge_files     : function (token,extension){
    	merge_files(token,extension);
    }, 
    copy_to_mount     : function (mnt,file_name,token,dest){
    	copy_to_mount(mnt,file_name,token,dest);
    }
}; 
