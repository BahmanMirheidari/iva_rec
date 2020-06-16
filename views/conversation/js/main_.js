$(function(){
	//window.WebSocket = window.WebSocket || window.MozWebSocket;
	//var ws = new WebSocket('ws://143.167.100.104:8080'); 
    	//ws.send('foo'); 
	//export { ws }; 
	 
	var getQueryString = function ( field, url ) {
	    var href = url ? url : window.location.href;
	    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	    var string = reg.exec(href);
	    return string ? string[1] : null;
	};

	//get window size 
	var w = window.innerWidth;
	var h = window.innerHeight;
	SDK.applicationId = "6953184431772864170";
	var sdk = new SDKConnection();
	var web = new WebAvatar();
	var avatarSet=false; 

	function playSound(soundfile) { 
                  var audio = new Audio(soundfile);
                  audio.play(); 
          }

	function playAvatar(message){
		var msgLength=message.length;
		var delay=msgLength*67;
		disableButton($("#repeatMessageButton"), delay);
		disableButton($("#nextMessageButton"), delay);
		disableButton($("#stopButton"), delay);
		if(avatarSet==false)
			setAvatar();

		web.addMessage(message, "like", "", ""); 
		web.processMessages();

		if (currentQuestionIndex==bellsIndex) 
			setTimeout(function(){ 
				playBuzzerBells(3000,30000,30000);

    			}, delay); 	
		else
			if (currentQuestionIndex==buzzerIndex) 
				setTimeout(function(){ 
					playBuzzers(3000,60000);

	    			}, delay); 	
	} 

	function setAvatar(){
		web.connection = sdk; 

		//default avatar
		web.avatar = "792824";      //Logan no emotion
		//default voice
		web.voice = "dfki-spike-hsmm";

		//read avname and avvoice from query string
		var avatarName=getQueryString('avname');
		var avatarVoice=getQueryString('avvoice'); 
		var quickMode=getQueryString('quickmode');
		var directValues=getQueryString('directvalues');  
		directValues= directValues=='true' ? true :false;
		quickMode= quickMode=='true' ? true :false; 

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

	//plays the current question 
	function playQuestion(){
		if (currentQuestionIndex>1){
			$('#divQuestionNo').removeClass('hidden');
		 	$('#divQuestionNo').text('Question '+(currentQuestionIndex-1).toString()+ '/' +(maxQuestions-2).toString());
		}

		playAvatar(questions[currentQuestionIndex]);
	} 

	//list of questions that avatar asks 
	/*var questions={ 0:'End of questions, thanks for coming and completing the questions',1:'Hi I am Logan and I am going to ask you some questions. Please listen carefully to the questions then answer. You can press repeat button to listen again or you can press next button for the next question. Thank you, if you are ready now please press next button',2:'Can you tell me what problems you have noticed with your memory and what are your expectations today?',3:'Do you know why you have been asked to come to clinic to speak with me today?',4:'Can you tell about what school you went to and how old were you when you left',5:'Can you tell what you did when you left school- what jobs did you do?',
	6:'What was your last job and if you are no longer working when did you stop working?',7:'What did you do over last weekend, giving as much detail as you can?',8:'What has been in the news recently?',9:'Who manages the finances yourself or your partner or wife? Has this changed recently',10:'Who is most worried about your memory?',11:'CBefore we finish I would like to do some very simple tests with you. For the first test, please name as many animals as you can in one minute- please start after you hear the buzzer. You can name any animal you can think of.',12:'For the second test, can you name as many words that begin with the letter P as you can? It can be any word beginning with P except for names or people such as Peter or names of countries such as Portugal. Please start answering after you hear the buzzer. A short bell will sound after 30 seconds and along bell will signal the end at 60 seconds.'}; */

	var questions={ 0:'End of questions, thanks for completing the questions. Please "wait" until we upload the recording.',1:'Hi I am Logan and I am going to ask you some questions. Please listen carefully to the questions then answer. You can press repeat button to listen again or you can press next button for the next question. Thank you, if you are ready now please press next button',2:'First I would like to get to know you a bit. Can you tell about what school you went to and how old were you when you left?',3:'Can you tell what you did when you left school- what jobs did you do?',4:'What was your last job? Are you still working at the moment or have you stopped working',5:'Who manages the finances yourself or your partner or wife? Has this changed recently?',6:'Now I would like to ask you some questions about more recent events. What did you do over last weekend. Please tell me in , as much detail as you can?',7:'What has been in the news recently?',8:'Do you know why you have been asked to come to clinic/to speak with me today?',9:'Can you tell me what problems you have noticed with your memory and what are your expectations today?',10:'Who is most worried about your memory you or other people?',11:'Before we finish I would like to do some very simple tests with you. For the first test, please name as many animals as you can in one minute- please start after you hear the buzzer. You can name any animal you can think of.',12:'For the second test, can you name as many words that begin with the letter P as you can? It can be any word beginning with P except for names or people such as Peter or names of countries such as Portugal. Please start answering after you hear the buzzer. A short bell will sound after 30 seconds and along bell will signal the end at 60 seconds.'};

	var bellsIndex=12;
	var buzzerIndex=11;  

	//index of the current question 
	var currentQuestionIndex=1; 
	var maxQuestions=Object.keys(questions).length; 

	function playBuzzers(initialDelay,buzzerInterval){
		var intervals=initialDelay+buzzerInterval;
		disableButton($("#repeatMessageButton"), intervals);
		disableButton($("#nextMessageButton"), intervals);
		disableButton($("#stopButton"), intervals);
		setTimeout(function(){
        		playSound('Buzzer/Buzzer1.mp3');

        		setTimeout(function(){
	        		playSound('Buzzer/Buzzer1.mp3');

	        		//click next after 3 seconds
	        		autoClickNext(3000);

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
		disableButton($("#stopButton"), intervals);
		setTimeout(function(){
        		playSound('Buzzer/Buzzer1.mp3');

        		setTimeout(function(){
	        		playSound('Buzzer/Bell1.mp3');

	        		setTimeout(function(){
		        		playSound('Buzzer/Bell2.mp3');
		        		//click next after 3 seconds
		        		autoClickNext(3000);
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
	    	currentQuestionIndex=1; 
			$(this).hide();
			//$('#startAvatarButton').text('Recording').button("refresh"); 
			$("#repeatMessageButton").removeClass("hidden"); 
			$("#repeatMessageButton").show(); 

			$("#nextMessageButton").removeClass("hidden");  
			$("#nextMessageButton").show(); 

			$("#stopButton").removeClass("hidden");  
			$("#stopButton").show(); 

			$('#divAlert').removeClass('alert-info').addClass('alert-danger');

			//start recording
			startRecording();

		 	$('#divAlert').text('Recording ...');
			playAvatar(questions[currentQuestionIndex]);
			
			return false;
	    }); 

	// next Message Button
   	$("#nextMessageButton").click(function(){  
		if (currentQuestionIndex==maxQuestions-1){ 
			currentQuestionIndex=0; 
			playAvatar(questions[0]); 
			
			//$('#divAlert').removeClass('alert-danger').addClass('alert-success');
	 		$('#divAlert').text("Please wait ...");
			$('#divQuestionNo').addClass('hidden');
			$('#repeatMessageButton').addClass('hidden').button("refresh");
			$('#stopButton').addClass('hidden').button("refresh");
			$(this).hide();
			
			//stop recording
			stopRecording();

			//$('#recordingslist').removeClass('hidden');
			//$("#startAvatarButton").show();


		}
		else{   //2018/11/15 *****<Start>*****
                        //stop recording and re record
			reRecord(); 
                        //2018/11/15 *****<End>*****

			//increment index
			currentQuestionIndex++;
			//play current question
			playQuestion();
		}

		return false;
	    }); 

	// repeat Message Button
    	$("#repeatMessageButton").click(function(){   
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
		$('#stopButton').addClass('hidden').button("refresh");
		$('#repeatMessageButton').addClass('hidden').button("refresh");
		$('#nextMessageButton').addClass('hidden').button("refresh");
		currentQuestionIndex=1;  
	}    
	 

  var audio_context;
  var recorder;

  function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream); 

    // Feedback!
    //input.connect(audio_context.destination);
    
    recorder = new Recorder(input, {
                  numChannels: 1
                }); 
  }

  function startRecording() {
    ws.send('startRecording'); 
    recorder && recorder.record(); 
    
  }

  function stopRecording() {
    ws.send('stopRecording'); 
    recorder && recorder.stop(); 
    

    // create WAV download link using audio data blob
    createDownloadLink();

    recorder.clear();
  }


 function reRecord() {
    ws.send('reRecord'); 
    recorder && recorder.stop(); 
    

    // create WAV download link using audio data blob
    createDownloadLink();

    recorder.clear();
    recorder && recorder.record(); 
  }

  function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
      /*var url = URL.createObjectURL(blob);
      var li = document.createElement('li');
      var au = document.createElement('audio');
      var hf = document.createElement('a');

      au.controls = true;
      au.src = url;
      hf.href = url;
      hf.download = new Date().toISOString() + '.wav';
      hf.innerHTML = hf.download;
      li.appendChild(au);
      li.appendChild(hf);
      recordingslist.appendChild(li);*/
    });
  }

  window.onload = function init() {
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!navigator.getUserMedia)
      		navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
      window.URL = window.URL || window.webkitURL;

      audio_context = new AudioContext;


    	if (navigator.getUserMedia){
   			 navigator.getUserMedia({audio:true}, startUserMedia, function(e) {
   			 	$('#divContainer').addClass('hidden');
   			 	alert('Error capturing audio.');


    		}); 
		 var browser='',platform=''; 
		 if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) 
		    {
			 browser='Opera';
		    }
		    else if(navigator.userAgent.indexOf("Chrome") != -1 )
		    {
			 browser='Chrome';
		    }
		    else if(navigator.userAgent.indexOf("Safari") != -1)
		    {
			 browser='Safari';
		    }
		    else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
		    {
			 browser='Firefox';
		    }
		    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
		    {
			 browser='IE'; 
		    }  
		    else 
		    {
		       browser='unknown';
		    }

		if(navigator.platform.indexOf("Linux")!=-1){
		  platform='Linux';
		}
		else if(navigator.platform.indexOf("Mac")!=-1){
		   platform='Mac';
		}

		else if(navigator.platform.indexOf("Win")!=-1){
		   platform='Win';
		}
		else
		{
		 platform='unknown';
		}

		if (browser!='unknown' && platform!='unknown')
		{
			$('#divContainer').removeClass('hidden');
		}
		else
		{
			$('#divContainer').addClass('hidden');
			alert('Cannot suport avatar ...');
		} 
   			
		} 
		else {
			$('#divContainer').addClass('hidden');
			alert('getUserMedia not supported in this browser.'); 
		} 
      
    } catch (e) {
    	$('#divContainer').addClass('hidden');
      	alert('No web audio support in this browser!');
    }
 

  	};

}); 
