fs             = require( 'fs' );
pass           = require( '/home/sa_ac1bm/upload_files/config.js' ); 

const { exec } = require('child_process');
merge_command  = "/home/sa_ac1bm/upload_files/merge_webm.sh";

function mkdir(dirname){
	if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
    } 
} 
  
function merge_files(dirname,token,mnt){  
    const ls = exec(merge_command + " " + dirname + "/uploads/" + token , function (error, stdout, stderr) {
    if (error) {
      logger.error(error.stack); 
    }
    else{ 
      src  = dirname + "/uploads/" + token;
      dst1 = dirname + "/dane/" + token; 
      fs.rename(src, dst1, function (err) {
        if (err) {
          logger.error('error in renaming: '+err);
        }
        else{
          logger.info('renamed to ' + dst1); 

          copy_to_mount(mnt,dst1 + "/All_Q.webm",token,"All_Q.webm");  
        }
      });
    } 
    });  
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
  mkdir(mnt + "/" + token); 
  fs.copyFile(file_name, mnt + "/" + token + "/" + dest, function(err){
    if (!err){
      logger.info('copied ' + file_name + ' to ' + mnt + "/" + token); 
    }  
    else{
    	logger.error('Error in copying '+ file_name + ' to ' + mnt + "/" + token + err)
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
  else{
  	copy_mount(mnt,file_name,token,dest);
  } 
} 
 
function process_content(data,dirname,mnt){
	length = data.agreements.length;
	csv_file = "consent.csv";
	sub_folder = dirname + "/uploads/" + data.token;
    consent = ''; 
    for (i=0;i<length;i++){
      consent += data.agreements[i] + "\n"; 
    }

    logger.info('recived consent for ' + data.token);  
    mkdir(sub_folder); 

    fs.writeFile(sub_folder + "/" + csv_file, consent, function(err) {
        if(err) {
          logger.error('error in saving consent file (' + sub_folder + "/" + csv_file + ')' +err); 
        } 
        else{
        	logger.info('consent file (' + sub_folder + "/" + csv_file + ') was saved.'); 
        	copy_to_mount(mnt,sub_folder + "/" + csv_file,data.token,csv_file);
        } 
    });  
}

function process_survey(data,dirname,mnt){
	length = data.questions.length;
    index =  data.id; 
    csv_file = "survey" + index.toString() + ".csv";
    sub_folder1 = dirname + "/uploads/" + data.token;
    sub_folder2 = dirname + "/dane/" + data.token;
    survey = ''; 
    for (i=0;i<length;i++){
      survey += data.questions[i] + "\n"; 
    }
    logger.info('recived servey ' + index.toString() + ' for ' + data.token);

    // check uploads first then dane (archive)
    if (fs.existsSync(sub_folder1)) {
        fs.writeFile(sub_folder1 + "/" + csv_file, survey, function(err) {
          if(err) {
            logger.error('error in saving survey' + index.toString() + ' (' + sub_folder1 + "/" + csv_file + ') - ' + err); 
          } 
          else{
            logger.info('survey' + index.toString() + ' (' + sub_folder1 + "/" + csv_file + ') - was saved.'); 
            copy_to_mount(mnt,sub_folder1 + "/" + csv_file,data.token,csv_file);
          } 
      });  
    } 
    else{
    	// else if .copied exists remove it
      if (fs.existsSync(sub_folder2 + '.copied')) {
        fs.unlinkSync(sub_folder2 + '.copied');}

        fs.writeFile(sub_folder2 + "/" + csv_file, survey, function(err) {
          if(err) {
            logger.error('error in saving survey' + index.toString() + ' (' + sub_folder2 + "/" +csv_file + ') - ' + err); 
          } 
          else{
            logger.info('survey' + index.toString() + ' (' + sub_folder2 + "/" + csv_file + ') - was saved.');
			copy_to_mount(mnt,sub_folder2 + "/" + csv_file,data.token,csv_file);
          } 
        }); 
    }  
} 

module.exports = { 
	mkdir           : function(dirname){
		mkdir(dirname);
	},
    merge_files     : function (dirname,token,mnt){
    	merge_files(dirname,token,mnt);
    }, 
    copy_to_mount   : function (mnt,file_name,token,dest){
    	copy_to_mount(mnt,file_name,token,dest);
    },
    process_content   : function (data,dirname,mnt){
    	process_content(data,dirname,mnt);
    },
    process_survey   : function (data,dirname,mnt){
    	process_survey(data,dirname,mnt);
    }
}; 
