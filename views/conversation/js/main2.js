$(function(){ 
	var startTime=null; 
	var killPreviousTimer=false;
	//start stop watch
	function startStopWatch(){
		var date = new Date(); 
		startTime=date.getTime();
	}

	//stop stop watch
	function stopStopWatch(){
		if (startTime==null)
			return;
		startTime=null;
		//$('#divStopWatch').addClass('hidden');
	}

	//get stop watch time (format 00:00)
	function getStopWatch(){
		var date = new Date();
		if (startTime==null)
			sec= 0;
		else 
			sec=parseInt((date.getTime() - startTime) / 1000);

    	var hours   = Math.floor(sec / 3600);
    	var minutes = Math.floor((sec - (hours * 3600)) / 60);
    	var seconds = sec - (hours * 3600) - (minutes * 60);

    	//if (hours   < 10) {hours   = "0"+hours;}
    	if (minutes < 10) {minutes = "0"+minutes;}
    	if (seconds < 10) {seconds = "0"+seconds;}
    	return minutes+':'+seconds;
	}

	function displayTimer(reps, delay) { 
		$('#divStopWatch').text('Timer '+getStopWatch()); 
		if(killPreviousTimer==true)
			return;
  		if (reps >= 0)
    		setTimeout(function() {  
         		displayTimer(reps-1, delay);
    			}, delay);
    	else{
	    	stopStopWatch();
	    	$('#divStopWatch').removeClass('alert-warning').addClass('alert-danger');
	    	$('#divStopWatch').text('End'); 
	    	} 
	}
	function killTimer(delay){
		killPreviousTimer=true;
		setTimeout(function(){
			killPreviousTimer=false;
		},delay);
	}

	function displayStopWatch(initDelay,seconds,displayIntervals){ 
	    //kill previous timer first in case it is running
		killTimer(initDelay);
	    
		setTimeout(function(){
			$('#divStopWatch').removeClass('hidden');
			$('#divStopWatch').show()
			startStopWatch();
			//60 seconds timer
			displayTimer(seconds, displayIntervals); 

			}, initDelay); 
	}
	var nextPressed=false;
    var repeatPressed=false;
    
    //listen to keys
    $(document).keydown(function(event){
	    //spacebar pressed for next
	    if(event.which ===32 && repeatPressed==false){
	    	if ($("#startAvatarButton").is(':hidden')) 
    			$("#repeatMessageButton").trigger('click');
	    	else  
    			$("#startAvatarButton").trigger('click'); 
	    }
	    //backspace pressed for repeat
	    else if (event.which ===13 && nextPressed==false){
	    	if ($("#startAvatarButton").is(':hidden'))
	    		$("#nextMessageButton").trigger('click');
	    	else 
	    		$("#startAvatarButton").trigger('click'); 
	    } 
   });

    function convertToBool(value){
		value= value==='true' ? true:false;
		return value;
	}

    //get value from query string
	var getQueryString = function ( field, url ) {
	    var href = url ? url : window.location.href;
	    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	    var string = reg.exec(href);
	    return string ? string[1] : null;
	};

	var offline=true;
	//get window size 
	var w = window.innerWidth;
	var h = window.innerHeight;
	var videoHidden=true;


	SDK.applicationId = "6953184431772864170";
	var sdk = new SDKConnection();
	var web = new WebAvatar();
	web.connection = sdk;
	var avatarSet=false;
	var avatarName=getQueryString('avname'); //to set avatar name
	var avatarVoice=getQueryString('avvoice'); //to set voice
	quickMode=convertToBool(getQueryString('quickmode'));//quick mode with a few questions
	directValues=convertToBool(getQueryString('directvalues')); //values are direct or no
	googlevoice=convertToBool(getQueryString('googlevoice')); //use google male voice
	speak=true;//convertToBool(getQueryString('speak'));  //speak TTS or play predefined audio files
    //buzzers=convertToBool(getQueryString('buzzers'));  // buzzers bool
    buzzers=true;
    //recordconversation=convertToBool(getQueryString('recordconversation'));  // record conversation bool  

	function setAvatar(){ 
		//default avatar
		web.avatar = "792824";      //Logan no emotion
		//default voice
		web.voice = "cmu-bdl-hsmm";  
		web.speak=speak; 
    	//qoogle voice
    	if(googlevoice==true){
        	web.nativeVoice = true;
        	web.nativeVoiceName = "Google UK English Male";
    	}

        //quick mode only 4 questions
		if (quickMode==true){
			var q={};
		    q[0]=questions[0];
			q[1]=questions[1];
			q[2]=questions[2];
			q[3]=questions[maxQuestions-2];
			q[4]=questions[maxQuestions-1];

			questions=q;
			maxQuestions=5; 
			bellsIndex=4;
	        buzzerIndex=3;  
		}

		if (avatarName!=null) 
		 	{ 
			switch(avatarName.toLowerCase()) {
				//male
			    case 'jake':
			        web.avatar = "677531";    //Jake.webm, emotion:like, action:smile
			        break;
			     case 'jakef':
			        web.avatar = "688449";    //Jake full
			        break; 
			    case 'logan2':
			        web.avatar = "793589";    //Logan2 no emotion bald
			        break; 
		        case 'steve':
			        web.avatar = "775411";    //Steve no emotion
			        break; 
		        //female
		        case 'julie':
			        web.avatar = "667648";    //Julie.webm, emotion:love, like,happy,..., action:smile, laugh, .. 
			        break; 
		        case 'julie3':
			        web.avatar = "11571268";   //Julie3.webm, emotion:love, like,happy,..., action:smile, laugh, .. 
			        break; 
		        case 'julieb':
			        web.avatar = "11785361";   //Julie business
			        break; 
			        
		        case 'sandy':
			        web.avatar = "780622";    //Sandy no emotion
			        break; 
		        case 'joanie':
			        web.avatar = "1115544";   //Joanie.webm no emotion
			        break; 
		        case 'nicolette':
			        web.avatar = "895343";    //Nicolette no emotion
			        break;  
			    case 'wendy':
			        web.avatar="11724352";    //wendy
			        break; 
			    case 'cindy':
			        web.avatar="716746";      //Cindy
			        break; 
			    //smily
		        case 'smily':
			        web.avatar = "667642";    //smily
			        break; 

			    default: 
			    	if (directValues==true)
			    		web.avatar=avatarName;
			    	break;

			} 
		}

		if (avatarVoice!=null) 
		 	{ 
			switch(avatarVoice.toLowerCase()) {
				//male
			    case 'spike2':
			        web.voice = "dfki-spike";
			        break;

			     case 'obadiah':
			        web.voice = "dfki-obadiah-hsmm"; 
			        break; 
			    case 'obadiah2':
			        web.voice = "dfki-obadiah";
			        break; 
		        //female
		        case 'prudence':
			        web.voice = "dfki-prudence-hsmm";   
			        break;  
		        case 'prudence2':
			        web.voice = "dfki-prudence";
			        break; 

		        case 'poppy':
			        web.voice = "dfki-poppy-hsmm";
			        break; 
		        case 'poppy2':
			        web.voice = "dfki-poppy"; 
			        break; 

		        default: 
			    	if (directValues==true)
			    		web.voice=avatarVoice;
			    	break;
 
			} 
		}
 
		web.width = w*0.45;
		web.height = h*0.95;
		web.createBox(); 
		avatarSet=true;
	}

	function pause(milliseconds) {
		var dt = new Date();
		while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
	} 

	function timedPlayAvt(messages, reps, delay) {
		index=messages.length-reps
		msg=messages[index];
		playAVT(msg.message,index,msg.length);
  		if (reps > 1)
    		setTimeout(function() {  
         	timedPlayAvt(messages,reps-1, msg.delay);
    	}, delay);
	}

	function playMp4(){ 
		if (videoHidden==true) {
			$("#divVideo").removeClass('hidden');
			videoHidden=false;
		} 
		
		var video = document.getElementById("videoMp4");

		video.width=w*0.55;
		video.height = h*0.85;
	
	   video.src = 'mp4/q_'+currentQuestionIndex+'.mp4'; 
	   video.play();

	}

	//play avatar
	function playAvatar(messages)  
	{  
		var mlen=messages.length; 
		if (offline==true)
			playMp4();
		else
    		timedPlayAvt(messages, mlen, messages[0].delay); 

		var delay=0
		for(var j=0;j<mlen;j++)
			delay+=messages[j].length;
		if(buzzers==true){
			/*if (currentQuestionIndex==bellsIndex) 
				setTimeout(function(){ 
					playBuzzerBells(3000,30000,30000);

    				}, delay); 	
			else*/
			if (currentQuestionIndex==buzzerIndex) 
				setTimeout(function(){ 
					playBuzzers(500,60000);

    				}, delay); 	

			if (currentQuestionIndex==bellsIndex) 
				setTimeout(function(){ 
					playBuzzers(500,60000);

    				}, delay); 	
		}
		
		if (currentQuestionIndex==buzzerIndex) 
			displayStopWatch(11500,60,1000); 
		else
			if (currentQuestionIndex==bellsIndex) 
			displayStopWatch(16000,60,1000); 

		if (currentQuestionIndex==cookieTheftIndex) 
			$("#divShowCookieTheftImage").removeClass('hidden');
		else 
 			$("#divShowCookieTheftImage").removeClass('hidden').addClass('hidden');

 		//if (currentQuestionIndex==optionsIndex1 || currentQuestionIndex==optionsIndex2)
		//	$("#divOptions").removeClass('hidden');
		//else 
 		//	$("#divOptions").removeClass('hidden').addClass('hidden');
 		
	}

	//disable enter and space keys for a while
	function disableKeys(intervals){
		nextPressed=true;
		repeatPressed=true;
    		setTimeout(function(){
        		nextPressed=false;
        		repeatPressed=false;
    			}, intervals); 
	}

	function playAVT(message,index,intervals)  
	{   
		disableButton($("#repeatMessageButton"), intervals+1000); 
		disableButton($("#nextMessageButton"),intervals+1000);
		disableKeys(intervals); 
		
		//disableButton($("#stopButton"), intervals);
		if(avatarSet==false)
			setAvatar();  
		web.addMessage(message, "", "", "");
		web.processMessages(); 	

		if(index>=0){
			//play the ending message
			//if (currentQuestionIndex==maxQuestions)
			//{
			//	playSound("Questions/Q_ENDING.wav"); 
			//}
				
			//else
			//{
			var i=parseInt(currentQuestionIndex)+0;
			var post= index==0 ?'':'_'+index
			var questionPath="Questions/Q_"+i+post+".mp3"; 
			playSound(questionPath);
			//} 
		}
	} 
	//play audio
	function playSound(soundfile) { 
                  var audio = new Audio(soundfile);
                  audio.play(); 
          }

	//plays the current question 
	function playQuestion(){
		if (currentQuestionIndex>0){
			$('#divQuestionNo').removeClass('hidden');
		 	$('#divQuestionNo').text('Question '+(currentQuestionIndex).toString()+ '/' +(maxQuestions-1).toString());
		}
		stopStopWatch();

		playAvatar(questions[currentQuestionIndex]);
	} 

	//list of questions that avatar asks 
	var questions={ 0:[{length:14500,delay:0,message:'Hello I am the Avatar consultant and I will be asking you questions today, This Avatar is designed to reproduce what happens in the memory clinic, Thank you for agreeing to take part, I will start to ask you questions shortly'}],
	                1:[{length:5500,delay:0,message:'Why have you come today and what are your expectations?'}],
	                2:[{length:5600,delay:0,message:'Tell me what problems you have noticed with your memory recently'}],
	                3:[{length:6400,delay:0,message:'Who is most worried about your memory, you or somebody else?'}],
	                4:[{length:6600,delay:0,message:'What did you do over last weekend, giving as much detail as you can?'}],
	                5:[{length:4300,delay:0,message:'What has been in the news recently?'}],           
	                6:[{length:6300,delay:0,message:'Tell me about the school you went to and how old were you when you left'}],
	                7:[{length:6100,delay:0,message:'Tell me what you did when you left school- what jobs did you do?'}],
	                8:[{length:5900,delay:0,message:'Tell me about your last job? Give as much detail as you can'}],
	                9:[{length:7600,delay:0,message:'Who manages your finances?  you or somebody else? Has this changed recently?'}],
	                10:[{length:10400,delay:0,message:'Please name as many animals as you can. You can name any type of animal, You will have one minute, please start after you hear the buzze'}],
	                11:[{length:15100,delay:0,message:'Please name as many words as you can that begin with the letter P, It can be any word beginning with P except for names or people such as Peter or names of countries such as Portugal, Please start answering after you hear the buzzer'}],
	                12:[{length:7500,delay:0,message:'Please describe this picture in as much detail as you can, When you have finished press forward'}],
	                13:[{length:5400,delay:0,message:"Thank you taking part, The trial is now complete"}] 
	            };   

	var bellsIndex=11;
	var buzzerIndex=10;  
	var cookieTheftIndex=12;
	//var optionsIndex1=900;
	//var optionsIndex2=100;
	//index of the current question 
	
	var maxQuestions=Object.keys(questions).length-1; 

	function playBuzzers(initialDelay,buzzerInterval){
		var intervals=initialDelay+buzzerInterval;
		disableButton($("#repeatMessageButton"), intervals); 
		disableButton($("#nextMessageButton"), intervals); 
		disableKeys(intervals);  
		//disableButton($("#stopButton"), intervals);
		setTimeout(function(){
		playSound('Buzzer/Buzzer1.mp3');

		setTimeout(function(){
    		playSound('Buzzer/Buzzer1.mp3');

    		//click next after 1 second
    		//autoClickNext(1000); 

			}, buzzerInterval);

		}, initialDelay); 
	}

	function autoClickNext(interval){
		setTimeout(function(){
			$('#nextMessageButton').trigger('click');
			}, interval); 
	}

	function playBuzzerBells(initialDelay,bell1Interval,bell2Interval){
		var intervals=initialDelay+bell1Interval+bell2Interval;
		disableButton($("#repeatMessageButton"), intervals); 
		disableButton($("#nextMessageButton"), intervals);
		disableKeys(intervals);  
 
		//disableButton($("#stopButton"), intervals);
		setTimeout(function(){
        playSound('Buzzer/Buzzer1.mp3');

        setTimeout(function(){
	    playSound('Buzzer/Bell1.mp3');

	    setTimeout(function(){
			playSound('Buzzer/Bell2.mp3');
    		//click next after 1 second
    		//autoClickNext(1000);
			}, bell2Interval);

	    	}, bell1Interval);

    	}, initialDelay); 
	}
	
	
	//disable the button for a while
	function disableButton(btn,delay){
	  	btn.prop('disabled', true);
    		setTimeout(function(){
        		btn.prop('disabled', false);
    			}, delay);
		}  
 
	// stop Button
	$("#stopButton").click(function(){  
    	$("#stopRecordingModal").modal('show');
		
		return false;
    });

    // stop  recording Button
	$("#stopRecordingButton").click(function(){  
		recorder.clear();
		initialise();
	    $("#stopRecordingModal").modal('hide'); 
		return false;
    }); 

   
	// start Avatar Button, introduces the interview
	$("#startAvatarButton").click(function(){  
    	currentQuestionIndex=0; 
		$(this).hide();
		//$('#startAvatarButton').text('Recording').button("refresh"); 
		$("#repeatMessageButton").removeClass("hidden"); 
		$("#repeatMessageButton").show(); 

		$("#nextMessageButton").removeClass("hidden");  
		$("#nextMessageButton").show(); 

		//$("#stopButton").removeClass("hidden");  
		//$("#stopButton").show(); 

		$('#divAlert').removeClass('alert-info').addClass('alert-danger');

		//start recording
		//startRecording();

	 	$('#divAlert').text('Recording ...');
		playQuestion();
		
		return false;
    }); 

	// next Message Button
   	$("#nextMessageButton").click(function(){   
   		$('#divStopWatch').removeClass('alert-danger').addClass('alert-warning').addClass('hidden');
		//increment index
		currentQuestionIndex++;  
                repeatIndex = 0;
		//start recording
		startRecording();

		if (currentQuestionIndex==maxQuestions){  
			stopRecording(); 
			$('#divContainer').addClass('hidden');

			$('#divEnding').removeClass('hidden'); 

			$('#divEndingMessage').text(questions[currentQuestionIndex][0].message);   
			//play ending question 
			playQuestion();

			return false;
		} 
		else
			//play current question
			playQuestion();

		
		return false;
	    }); 

	// repeat Message Button
    	$("#repeatMessageButton").click(function(){ 
                repeatIndex++;
                //start recording
		startRecording();
  
		//play current question
		playQuestion(); 
		return false;
	    });  

	function initialise(){

		$('#divAlert').removeClass('alert-danger').addClass('alert-info');
	 	$('#divAlert').text('Press "Start" button to start recording ');

		$('#divQuestionNo').addClass('hidden');
		$('#divQuestionNo').text('');

		$('#repeatMessageButton').addClass('hidden').button("refresh");
		$('#startAvatarButton').removeClass('hidden').show();
		//$('#stopButton').addClass('hidden').button("refresh");
		$('#repeatMessageButton').addClass('hidden').button("refresh");
		$('#nextMessageButton').addClass('hidden').button("refresh");
		currentQuestionIndex=1;  
		('#divContainer').removeClass('hidden').show();
		
	}    
	 

  var audio_context;
  var recorder;
  var mediaRecorder;

  function startRecording() {  
	ws.send(JSON.stringify({msg:'startRecording - ' + currentQuestionIndex.toString() + ' - ' + repeatIndex.toString() ,data:token}));
    
    stopRecording();  
	recorder && recorder.record(); 

	mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'video/mp4';

    mediaRecorder.ondataavailable = function (blob) {
	    	//Take first value from queue
	        var value = queueVideo.shift();
	        // send data via the websocket 
	        ws.send(JSON.stringify({msg:'mp4',data:{token:token, q_no:value.q_no, r_no:value.r_no, data:blob.toString('base64')}}));  
	        //streamRecorder.clear();
	        //mediaRecorder.clear(); 
    	};  
    
  }

  function stopRecording() {
  	    //put value on end of queue
        queueAudio.push({q_no:currentQuestionIndex, r_no:repeatIndex});
        queueVideo.push({q_no:currentQuestionIndex, r_no:repeatIndex});

 
	    recorder && recorder.stop(); 
	    mediaRecorder.stop();
	    // create WAV download link using audio data blob 
	    recorder && recorder.exportWAV(function(blob) {
            //blob && blob.size > 1000 && ws.send(JSON.stringify({msg:'mp3',data:{token:token, q_no:currentQuestionIndex, r_no:repeatIndex, data:blob}})); 
            //Take first value from queue
            });


	    recorder && recorder.clear(); 
	    
  }
  
  function canvasDrawLine(oPosX, oPosY, fPosX, fPosY) {
			var ctx = getCanvas().getContext('2d');
			ctx.beginPath();
			ctx.moveTo(oPosX, oPosY);
			ctx.lineTo(fPosX, fPosY);
			ctx.stroke();
		}

		function canvasDrawSquare(ulPosX, ulPosY, lrPosX, lrPosY) {
			canvasDrawLine(ulPosX, ulPosY, ulPosX, lrPosY);
			canvasDrawLine(ulPosX, lrPosY, lrPosX, lrPosY);
			canvasDrawLine(lrPosX, lrPosY, lrPosX, ulPosY);
			canvasDrawLine(lrPosX, ulPosY, ulPosX, ulPosY);
		} 

		function canvasInitialize(width, height) {
			// Set canvas parameters
			getCanvas().width = width;
			getCanvas().height = height;

			// Outline
		    getCanvas().getContext('2d').clearRect(0,0,width,height);
			canvasDrawSquare(0,0,width,height);
		}

		function onSuccess(stream) {
			// stream -> mediaSource -> javascriptNode -> destination
		    var context = new AudioContext;
		    var mediaStreamSource = context.createMediaStreamSource(stream);
			var javascriptNode = context.createScriptProcessor(4096, 1, 1);
			mediaStreamSource.connect(javascriptNode);
			javascriptNode.connect(context.destination);
			
			javascriptNode.onaudioprocess = processBuffer;
	    
	    	recorder = new Recorder(mediaStreamSource, {
	                  numChannels: 1
	                });  
		}

		function processBuffer(e) {
			var micData = e.inputBuffer.getChannelData(0);
			var height = 50,  width= 80, modifier = 0.125;	
			// clear canvas and draw border
			getCanvas().getContext('2d').strokeStyle='#000000';
			canvasInitialize(width,height);

			
			// draw samples values in green
			getCanvas().getContext('2d').strokeStyle='#00ff00';
			//var average = 0;
			var gain = 100;
			for(var i=0; i<width; i++) {
				var sample1 = modifier * micData[2*i];
				var sample2 = modifier * micData[2*i+1];
				var val = (sample1+sample2)*gain; // combine two samples and multiply by gain
				canvasDrawSquare(i, height/2, i+1, height/2-val);
				//average = average + sample1*sample1 + sample2*sample2;
			}
			//average = Math.round(Math.sqrt(average) * 1000) / 1000;
			//getLog().innerHTML = average + '\n<br>';
		}

		function onError() {
			alert('Error');
		}

		function getLog() {
			return document.getElementById('mylog');
		}

		function getCanvas() {
			return document.getElementById('mycanvas');
		}	
		  
		
   	// Older browsers might not implement mediaDevices at all, so we set an empty object first
	if (navigator.mediaDevices === undefined) {
	  navigator.mediaDevices = {};
	}

	// Some browsers partially implement mediaDevices. We can't just assign an object
	// with getUserMedia as it would overwrite existing properties.
	// Here, we will just add the getUserMedia property if it's missing.
	if (navigator.mediaDevices.getUserMedia === undefined) {
	  navigator.mediaDevices.getUserMedia = function(constraints) {

	    // First get ahold of the legacy getUserMedia, if present
	    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	    // Some browsers just don't implement it - return a rejected promise with an error
	    // to keep a consistent interface
	    if (!getUserMedia) {
	      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
	    }

	    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
	    return new Promise(function(resolve, reject) {
	      getUserMedia.call(navigator, constraints, resolve, reject);
	    });
	  }
	}

	navigator.mediaDevices.getUserMedia({ audio: true, video: true })
	.then(function(stream) {
	  //webcam
	  var video =  document.querySelector('video'); 

	  // Older browsers may not have srcObject
	  if ("srcObject" in video) {
	    video.srcObject = stream;

	  } else {
	    // Avoid using this in new browsers, as it is going away.
	    video.src = window.URL.createObjectURL(stream);

	  }

	  //video
	  var streamRecorder = new MediaStreamRecorder(stream);
      streamRecorder.mimeType = 'video/mp4';

	  video.onloadedmetadata = function(e) {
	    video.play(); 
	  }; 

	  //for wave form
	  onSuccess(stream);

	})
	.catch(function(err) {
	  console.log(err.name + ": " + err.message);
	});


	initialise();
		   
}); 
