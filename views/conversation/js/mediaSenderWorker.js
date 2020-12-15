// mediaSenderWorker.js

var MEDIA_RECORDER, RECORDING_CHUNKS;
var video_count, audio_count, audio, start, stop, max_count, mediaRecorder, myAudioRecorder, audioOnlyStream, videoOnlyStream, liveStream;

self.addEventListener('message', function(e) {
  var dict = e.data; 
  token = dict.token;
  MEDIA_RECORDER = dict.MEDIA_RECORDER; 
  RECORDING_CHUNKS = dict.RECORDING_CHUNKS; 
  video_count = dict.video_count;
  audio_count = dict.audio_count;
  max_count = dict.max_count;
  mediaRecorder = dict.mediaRecorder;
  myAudioRecorder = dict.myAudioRecorder;
  audioOnlyStream = dict.audioOnlyStream;
  videoOnlyStream = dict.videoOnlyStream;
  liveStream = dict.liveStream; 
  audio = dict.audio;
  start = dict.start;
  stop = dict.stop;

  sendAudioVideo(audio, start, stop);  
});



function onMediaRecordingReady(e) { 
    var reader = new FileReader();
    reader.onload = function(event){
        var data = event.target.result.toString('base64');

        if (data.length>1000){
            //var time_diff = (new Date().getTime() - startDate.getTime()) / 1000; 
            // send data via the websocket  
            //alert('webm-audio-chunk' + token + '-' + currentQuestionIndex.toString()+ '-' + repeatIndex.toString()+ '-' + data.length.toString()+ '-' + last.toString());
            //video_count ++;
            if(video_count>=max_count){
                //RECORDING_FLAG=false; 

                //end_message(max_count_warning);
                self.postMessage({message:'max_count'});

            }
            /*ws.send(JSON.stringify({
                msg: 'video',
                data: {
                    token: token,
                    time_diff:time_diff.toString(), 
                    data: data, 
                    count:video_count,
                    ext:"webm"
                } 
            })); */

            self.postMessage({message:'video_count',data:data});
        } 
    }
    reader.readAsDataURL(e.data);  
}   

function sendAudioVideo(audio = true, start=true, stop=true) { 
	if (MEDIA_RECORDER){
		var time_diff = (new Date().getTime() - startDate.getTime()) / 1000; 
        time_diff> RECORDING_CHUNKS/2000 && stop && mediaRecorder && mediaRecorder.stop();

		if (start){
			mediaRecorder = new MediaRecorder(liveStream, {mimeType: 'video/webm'});  
            mediaRecorder.addEventListener('dataavailable', onMediaRecordingReady);   
            mediaRecorder.start(); 
        } 
	}  
	else{
		if (audio) {
            var time_diff = (new Date().getTime() - startDate.getTime()) / 1000; 
            time_diff> RECORDING_CHUNKS/2000 && stop && myAudioRecorder && myAudioRecorder.stop(function(blob_audio) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var data = event.target.result.toString('base64'); 

                    if (data.length > 100) {
                        //audio_count ++;
                        if(audio_count>=max_count && video_count>=max_count){
                            //RECORDING_FLAG=false;
                            //end_message(max_count_warning);
                            self.postMessage({message:'max_count'});
                        }
                    	//var time_diff = (new Date().getTime() - startDate.getTime()) / 1000; 
                        // send data via the websocket  
                        //alert('webm-audio-chunk' + token + '-' + currentQuestionIndex.toString()+ '-' + repeatIndex.toString()+ '-' + data.length.toString()+ '-' + last.toString());
                        /*ws.send(JSON.stringify({
                            msg: 'audio',
                            data: {
                                token: token,
		                        time_diff:time_diff.toString(), 
		                        data: data,
                                count:audio_count,
		                        ext: "webm"  
                            } 
                        }));*/
                        self.postMessage({message:'audio_count',data:data}); 
                    }
                }; 
                reader.readAsDataURL(blob_audio);
            });

            if(start){
            	myAudioRecorder = new MediaStreamRecorder(audioOnlyStream, {
                    type: 'audio',
                    mimeType: 'audio/webm'
                });
                myAudioRecorder.record();
            }
            
        } else {
            var time_diff = (new Date().getTime() - startDate.getTime()) / 1000; 
            time_diff> RECORDING_CHUNKS/2000 && stop && mediaRecorder && mediaRecorder.stop(function(blob_video) {  
                var reader = new FileReader();
                reader.onload = function(event) {
                    var data = event.target.result.toString('base64'); 

                    if (data.length > 100) {
                        //video_count ++;
                        if(audio_count>=max_count && video_count>=max_count){
                            //RECORDING_FLAG=false;
                            //end_message(max_count_warning);
                            self.postMessage({message:'max_count'});
                        }
                    	//var time_diff = (new Date().getTime() - startDate.getTime()) / 1000; 
                        // send data via the websocket  
                        //alert('webm-video-chunk' + token + '-' + currentQuestionIndex.toString()+ '-' + repeatIndex.toString()+ '-' + data.length.toString()+ '-' + last.toString());
                        /*ws.send(JSON.stringify({
                            msg: 'video',
                            data: {
                                token: token,
                                time_diff:time_diff.toString(), 
		                        data: data,
                                count:video_count,
		                        ext: "webm"  
                            } 
                        }));*/
                        self.postMessage({message:'video_count',data:data});  
                    }
                };
                reader.readAsDataURL(blob_video);
            });

            if (start){ 
                mediaRecorder = new MediaStreamRecorder(videoOnlyStream, {
                    type: 'video',
                    mimeType: 'video/webm'
                });
                mediaRecorder.record();
            }
    	}  
	} 
}
