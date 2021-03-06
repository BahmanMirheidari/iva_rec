fs             = require( 'fs' ),
ffmpeg = require('ffmpeg'),
fluentffmpeg = require('fluent-ffmpeg'),
Mp4Convert = require('mp4-convert');
pass           = require( '/home/sa_ac1bm/upload_files/config.js' ); 

const { exec } = require('child_process');
merge_command  = "/home/sa_ac1bm/upload_files/upload.sh";
merge2_command  = "/home/sa_ac1bm/upload_files/merge_two_video.sh";

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

          copy_to_mount(mnt,dst1 + "/Q1-12.mp3",token,"Q1-12.mp3");
          copy_to_mount(mnt,dst1 + "/Q1-12.mp4",token,"Q1-12.mp4"); 
        }
      });
    } 
    });  
  }  


function merge2(file1,file2,file3,cb){  
    var cmd = merge2_command + " " + file1 + " " + file2 + " " + file3; 
    logger.info('ran command:' + cmd); 
    const ls = exec(cmd, function (error, stdout, stderr) {
    if (error) {
      logger.error(error.stack);
      cb(error.stack);
    }
    else{   
      cb(null);
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

function unlink(file_name){
  fs.unlink(file_name , function(err) {
        if (err) {
            logger.error('Deleting ' + file_name + ' error: ' + err);
        } else {
            logger.info('Deleted ' + file_name);
        }
    });
}


function process_webmvideoaudio(mnt, logger,updateconversation, data, dirname, videoaudio='video',max_webm_size=500000000, max_count=180, split=false){
  var token = data.token; 
  var blob = data.data; 
  var sub_folder = dirname + "/uploads/" + token;
  var ext = data.ext;
  ext = '.'+ext;

  if (split && data.count !== undefined){
    // more than 1 hour ignore it
    if (data.count > max_count){
      return;
    }
    ext = '-' + data.count.toString()+ext;
  } 
  var dest = videoaudio + '-' + 'recording' + ext;
  var file_name = sub_folder + '/' + dest;  
  var base64Data = blob.split(';base64,').pop();
  mkdir(sub_folder);
  logger.info('received file: ' + file_name);
  if (!fs.existsSync(file_name)) { 
    fs.writeFile(file_name, base64Data, 'base64', function(err) {
      if (err) {
        logger.error('error in saving file (First blob): ' + file_name + " - " + err);
      } 
      else { 
        logger.info('saved file (First blob): ' + file_name );
        copy_to_mount(mnt, file_name, token, dest );
      }
    });
  }
  else{
    const stat = fs.statSync(file_name);  
    // more than 1 hour ignore it
    if (stat.size/max_webm_size <= 1)
      { 
      const fileStream = fs.createWriteStream(file_name, {
          flags: 'a'
      });

      fileStream.write(base64Data, 'base64', function(err) {
        if (err) {
          logger.error('error in saving file: ' + file_name + " - " + err);
        } 
        else { 
          logger.info('saved file: ' + file_name );
          copy_to_mount(mnt, file_name, token, dest );
        }
      }); 
      } 
  }  
}


function process_webmvideoaudio2(mnt, logger,updateconversation, data, dirname, videoaudio='video',max_webm_size=500000000, max_count=180, split=false){
  var token = data.token; 
  var blob = data.data; 
  var sub_folder = dirname + "/uploads/" + token;
  var ext = data.ext;
  ext = '.'+ext;

  if (split && data.count !== undefined){
    // more than 1 hour ignore it
    if (data.count > max_count){
      return;
    }
    ext = '-' + data.count.toString()+ext;
  } 
  var dest = videoaudio + '-' + 'recording' + ext;
  var file_name = sub_folder + '/' + dest;  
  var base64Data = blob.split(';base64,').pop();
  mkdir(sub_folder);
  logger.info('received file: ' + file_name);
  if (!fs.existsSync(file_name)) { 
    fs.writeFile(file_name, base64Data, 'base64', function(err) {
      if (err) {
        logger.error('error in saving file (First blob): ' + file_name + " - " + err);
      } 
      else { 
        logger.info('saved file (First blob): ' + file_name );
        //copy_to_mount(mnt, file_name, token, dest );

        if (videoaudio === 'video'){ 
          var mp4 = sub_folder + '/' + dest + ".mp4";
          var all_mp4 = sub_folder + '/all_video.mp4';
          var tmp_mp4 = sub_folder + '/tmp_video.mp4';
          var convert = new Mp4Convert(file_name, mp4);
          convert.on('done', function() {
              logger.info('converted to mp4 as ' + mp4); 

              unlink(file_name);

              if (!fs.existsSync(all_mp4)){
                fs.copyFile(mp4, all_mp4, function (err) {
                    if (err) {
                      logger.error('Error in copying ' + file_name + ":" + error);
                    }
                    else{
                      logger.info('saved file: ' + all_mp4 );
                      copy_to_mount(mnt, all_mp4, token, 'all_video.mp4' );
                    } 
                }); 

              }
              else{
                fs.copyFile(all_mp4, tmp_mp4, function (err) {
                    if (err) {
                      logger.error('Error in copying ' + tmp_mp4 + ":" + error);
                    }
                    else{ 
                      fs.unlinkSync(all_mp4);

                      merge2(tmp_mp4,mp4,all_mp4,function (err){
                        if (err){ 
                          logger.error('Error in merging ' + tmp_mp4 + ", " + mp4 + " - " +error);
                        }  
                        else{
                          copy_to_mount(mnt, all_mp4, token, 'all_video.mp4' ); 
                          unlink(tmp_mp4);
                          unlink(mp4);
                        }
                      });  
                    } 
                }); 
              }  

          });
          convert.start(); 

        }
        else{ 
          var mp3 = sub_folder + '/' + dest + ".mp3";
          var all_mp3 = sub_folder + '/all_audio.mp3';
          var tmp_mp3 = sub_folder + '/tmp_audio.mp3';

          var process = new ffmpeg(file_name);
          process.then(function(video) {
              //convert to mp3
              video.fnExtractSoundToMP3(mp3, function(error, file) {
                  if (!error) {
                      logger.info('converted to mp3 as ' + mp3);
                      unlink(file_name);

                      if (!fs.existsSync(all_mp3)){
                          fs.copyFile(mp3, all_mp3, function (err) {
                              if (err) {
                                logger.error('Error in copying ' + file_name + ":" + error);
                              }
                              else{
                                logger.info('saved file: ' + all_mp3 );
                                copy_to_mount(mnt, all_mp3, token, 'all_audio.mp3' );
                              } 
                          }); 

                        }
                        else{
                          fs.copyFile(all_mp3, tmp_mp3, function (err) {
                              if (err) {
                                logger.error('Error in copying ' + tmp_mp3 + ":" + error);
                              }
                              else{
                                fs.unlinkSync(all_mp3);

                                merge2(tmp_mp3,mp3,all_mp3,function (err){
                                  if (!err){ 
                                    copy_to_mount(mnt, all_mp3, token, 'all_audio.mp3' ); 
                                    unlink(tmp_mp3);
                                    unlink(mp3);
                                  }  
                                });  
                              } 
                          }); 
                        }   

                      } 
                  else
                      logger.error('Error in converting to mp3: ' + error);
                  });

              }, function(err) {
              logger.error('FFMPEG MP3 error: ' + err);
          });   
        } 
      }
    });
  }
  else{
    const stat = fs.statSync(file_name);  
    // more than 1 hour ignore it
    if (stat.size/max_webm_size <= 1)
      { 
      const fileStream = fs.createWriteStream(file_name, {
          flags: 'a'
      });

      fileStream.write(base64Data, 'base64', function(err) {
        if (err) {
          logger.error('error in saving file: ' + file_name + " - " + err);
        } 
        else { 
          logger.info('saved file: ' + file_name );
          copy_to_mount(mnt, file_name, token, dest );
        }
      }); 
      } 
  }  
}

function process_segment(mnt,logger,updateconversation, data, dirname){  
  var token = data.token;
  var q_no = data.q_no;
  var r_no = data.r_no;
  var time_diff = data.time_diff;
  var sub_folder = dirname + "/uploads/" + token;
  var dest = 'segments.txt';
  var file_name = sub_folder + '/' + dest;  
  var segment = q_no + ',' + r_no + ',' + time_diff;
  var segment_brf = 'segs-' + segment.replace(/,/g,'-');

  mkdir(sub_folder);

  fs.appendFileSync(file_name, segment + '\n');
 
  logger.info('recived segment for ' + token + ':' + segment + ' - brf:' + segment_brf);
  updateconversation(token, segment_brf);
  copy_to_mount(mnt,file_name,token,dest); 
}

function process_chuncks(mnt, logger,updateconversation, data, dirname, audio = true) {
  try{
    var token = data.token;
    var q_no = data.q_no;
    var r_no = data.r_no;
    var blob = data.data;
    var len = blob.length;
    var dest = 'Q' + q_no.toString() + '-R' + r_no.toString();
    var file_name = dirname + "/uploads/" + token + '/Q' + q_no.toString() + '-R' + r_no.toString();
    var ext = "-audio.webm";
    if (audio==false)
        ext = "-video.webm";

    if (!fs.existsSync(file_name + ext)) {
        /* changed 19/11/20 */
        updateconversation(token, ext + '-Q' + q_no.toString() + '-R' + r_no.toString() + '-L' + len.toString());
        logger.info(ext + ' file: ' + file_name + ext + ' - length: ' + len.toString());
    } 
 
    const fileStream = fs.createWriteStream(file_name + ext, {
        flags: 'a'
    });
    fileStream.write(new Buffer(blob.split(';base64,').pop(), 'base64'));
    //if (data.last)
    copy_to_mount(mnt, file_name + ext, token, dest + ext);  
  }
  catch(e){
    logger.error('handleChuncks-Error: ' + e);
  } 
}

//common.process_mp3mp4(msg, config.mount_dir, logger,updateconversation,data, __dirname, config.max_mp3_file,config.max_mp4_fil); 
function process_mp3mp4(msg, mnt, logger,updateconversation, data, dirname,max_mp3_file,max_mp4_file, last_q){
    var token = data.token;
    var q_no = data.q_no;
    var r_no = data.r_no;
    var blob = data.data;
    var len = blob.length;
    var dest = 'Q' + q_no.toString() + '-R' + r_no.toString();
    var file_name = dirname + "/uploads/" + token + '/Q' + q_no.toString() + '-R' + r_no.toString();
    logger.info(msg + ' file: ' + file_name + "." + msg + ' - length: ' + len.toString());
    /* changed 20/6/20 */
    updateconversation(token, msg + '-Q' + q_no.toString() + '-R' + r_no.toString() + '-L' + len.toString());

    var max_file_size;
    (msg == 'mp3') ? max_file_size = max_mp3_file: max_file_size = max_mp4_file;

    if (len < max_file_size && len > 200) {
        //var base64Data = blob.replace(/^data:audio\/mp3;base64,/, "").replace(/^data:video\/webm;base64,/, "");  
        var base64Data = blob.split(';base64,').pop();
        var continue_processing = true;

        if (msg == 'webm-audio') {
            file_name = file_name + '-audio';
            dest = dest + '-audio';
            msg = 'webm';
            continue_processing = false;
        }

        if (msg == 'webm-video') {
            file_name = file_name + '-video';
            dest = dest + '-video';
            msg = 'webm';
            continue_processing = false;
        }

        fs.writeFile(file_name + "." + msg, base64Data, 'base64', function(err) {
            if (err) {
                logger.error('error in saving ' + msg + ' file: ' + file_name + "." + msg + " - " + err);
            } else {

                logger.info('saved ' + msg + ' file: ' + file_name + "." + msg);
                copy_to_mount(mnt, file_name + "." + msg, token, dest + "." + msg);

                if (continue_processing && msg == 'webm') {

                    try {
                        var process = new ffmpeg(file_name + "." + msg);
                        process.then(function(video) {
                            //convert to mp3
                            video.fnExtractSoundToMP3(file_name + ".mp3", function(error, file) {
                                if (!error) {
                                    logger.info('converted to mp3 as ' + file_name + ".mp3");
                                    copy_to_mount(mnt, file_name + ".mp3", token, dest + ".mp3");

                                    var convert = new Mp4Convert(file_name + '.webm', file_name + ".mp4");
                                    convert.on('done', function() {
                                        logger.info('converted to mp4 as ' + file_name + ".mp4");
                                        copy_to_mount(mnt, file_name + ".mp4", token, dest + ".mp4");

                                        if (q_no == last_q - 1)
                                            merge_files(__dirname, token, mnt);

                                        unlink(file_name + ".webm");  
                                    });
                                    convert.start();
                                } else
                                    logger.error('Error in converting to mp3: ' + error);
                            });

                        }, function(err) {
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

function process_error(mnt, logger,updateconversation, data, dirname){
    logger.info('token: ' + data.error);    
    var sub_folder = dirname + "/uploads/" + data.token;
    var dest = 'error.txt';
    var file_name = sub_folder + '/' + dest;  
    mkdir(sub_folder); 
    fs.appendFileSync(file_name, data.error); 
    copy_to_mount(config.mount_dir, file_name, data.token, dest); 
}

function process_token(mnt, logger,updateconversation, data, dirname, osBrStr){
    logger.info('token: ' + data);  
    if (osBrStr !== undefined){  
        logger.info(data + ' - OS/BR INFO -' + osBrStr); 

        var sub_folder = dirname + "/uploads/" + data;
        var dest = 'browser_info.txt';
        var file_name = sub_folder + '/' + dest;  
        mkdir(sub_folder); 
        fs.appendFileSync(file_name, osBrStr); 
        updateconversation(data, 'start');
        copy_to_mount(mnt, file_name, data, dest); 
    } 
} 

module.exports = { 
      mkdir           : function(dirname){
        mkdir(dirname);
    },
    merge_files     : function (dirname,token,mnt){
        merge_files(dirname, token, mnt);
    }, 
    copy_to_mount   : function (mnt,file_name,token,dest){
        copy_to_mount(mnt, file_name, token, dest);
    },
    process_content   : function (data,dirname,mnt){
        process_content(data, dirname, mnt);
    },
    process_survey   : function (data,dirname,mnt){
        process_survey(data, dirname, mnt);
    },
    process_webmvideoaudio: function (mnt,logger,updateconversation, data, dirname, videoaudio, max_webm_size,max_count, split){
      process_webmvideoaudio(mnt,logger,updateconversation, data, dirname, videoaudio, max_webm_size,max_count, split);
    },
    process_segment: function (mnt,logger,updateconversation, data, dirname){
      process_segment(mnt,logger,updateconversation, data, dirname);
    },
    process_chuncks: function (mnt,logger,updateconversation, data, dirname, audio){
      process_chuncks(mnt,logger,updateconversation, data, dirname, audio);
    },
    process_mp3mp4: function (msg, mnt, logger,updateconversation, data, dirname,max_mp3_file,max_mp4_file,last_q){
      process_mp3mp4(msg, mnt, logger,updateconversation, data, dirname,max_mp3_file,max_mp4_file,last_q);
    },
    process_error: function (mnt,logger,updateconversation, data, dirname){
      process_error(mnt,logger,updateconversation, data, dirname);
    },
    process_token: function (mnt,logger,updateconversation, data, dirname, osBrStr){
      process_token(mnt,logger,updateconversation, data, dirname, osBrStr)
    } 
}; 
