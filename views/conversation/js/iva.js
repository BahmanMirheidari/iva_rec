$(function(){ 
	// shared variables 
	var ws = null;  
	var token = null;
	var currentQuestionIndex = 0;
	var repeatIndex = 0;
	var record = true;
	var queueAudio = [], queueVideo = [];  
	var today = new Date(); 
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();  
	var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();  
	var dateTime = date+'-'+time;
	var videoMimeType; 
	var startTime=null; 
	var killPreviousTimer=false; 
	var buzzers=true;
	var videoHidden=true;
	var nextPressed=false;
	var repeatPressed=false;  
	var audio_context; 
	var mediaRecorder;
	var liveStream;
	var chunks;
	var response = {};   
	var questions = configuration.questions;
	var maxQuestions=questions.length-1;    
   
	// start Avatar Button, introduces the interview
	$("#startAvatarButton").click(function(){  

		$("#consent").addClass('hidden');
		
		currentQuestionIndex=0; 
		$(this).hide(); 
		$("#repeatMessageButton").removeClass("hidden"); 
		$("#repeatMessageButton").show(); 

		$("#nextMessageButton").removeClass("hidden");  
		$("#nextMessageButton").show(); 

		disableButtonRN(); 

		$('#divAlert').removeClass('alert-info').addClass('alert-danger'); 

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

        disableButtonRN();

		//start recording
		startRecording();

		if (currentQuestionIndex==maxQuestions){  
			stopRecording(); 
			$('#divContainer').addClass('hidden');

			$('#divEnding').removeClass('hidden'); 

			$('#divEndingMessage').text(questions[currentQuestionIndex].text);   
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
        disableButtonRN();
        //start recording
		startRecording();
  
		//play current question
		playQuestion(); 
		return false;
	    });   

    //listen to keys
    $(document).keydown(function(event){
    	
	    //spacebar pressed for next
	    if(event.which ===32 && repeatPressed===false){ 
	    	if ($("#startAvatarButton").is(':hidden')) 
    			$("#repeatMessageButton").trigger('click');
	    	else  
    			$("#startAvatarButton").trigger('click'); 
	    }
	    //backspace pressed for repeat
	    else if (event.which ===13 && nextPressed===false){ 
	    	if ($("#startAvatarButton").is(':hidden'))
	    		$("#nextMessageButton").trigger('click');
	    	else 
	    		$("#startAvatarButton").trigger('click'); 
	    } 
   });

    // random number generator
    function S4() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
	}   
   
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
		$('#divStopWatch').removeClass('alert-danger').addClass('alert-warning');
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

    function convertToBool(value){
		value= value==='true' ? true:false;
		return value;
	}  

	function pause(milliseconds) {
		var dt = new Date();
		while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
	}    

	//play avatar
	function playAvatar()  
	{   
		if (videoHidden==true) {
			$("#divVideo").removeClass('hidden');
			videoHidden=false;
		} 
		  
		var video = document.getElementById("videoMp4"); 
	
	   	video.src = questions[currentQuestionIndex].video_url; 
	   	video.play();  

		var delay=0;
		if (currentQuestionIndex>0)
			delay += questions[currentQuestionIndex-1].length; 

		if (questions[currentQuestionIndex].play_buzzer){  
			setTimeout(function(){ 
				playBuzzers(500,60000);

				}, delay);   
			displayStopWatch(questions[currentQuestionIndex].length,60,1000);  
		}   

		if (questions[currentQuestionIndex].image_url === '') 
			$("#divDescriptionImage").addClass('hidden');
		else {
			$("#imgDescription").src = questions[currentQuestionIndex].image_url;
 			$("#divDescriptionImage").removeClass('hidden');  
		}
	}

	//disable enter and space keys for a while
	function disableKeysNext(intervals){
		nextPressed=true;
		setTimeout(function(){
			nextPressed=false;
			}, intervals); 
	}

	function disableKeysRepeat(intervals){
		repeatPressed=true;
		setTimeout(function(){
			repeatPressed=false;
			}, intervals); 
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

		playAvatar();
	}  

	function playBuzzers(initialDelay,buzzerInterval){
		var intervals=initialDelay+buzzerInterval; 
		setTimeout(function(){
		playSound('Buzzer/Buzzer1.mp3');

		setTimeout(function(){
    		playSound('Buzzer/Buzzer1.mp3'); 

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
	  	btn.addClass('disabledButton');
	  	btn.hide();
	  	$('#divStopWatch').hide();
		setTimeout(function(){
			btn.prop('disabled', false);
			btn.show();
			btn.removeClass('disabledButton');
			$('#divStopWatch').hide();
			}, delay);
	} 

    function disableButtonRN(){
		killTimer(3);
		disableButton($("#repeatMessageButton"), questions[currentQuestionIndex].length);
   		disableButton($("#nextMessageButton"), questions[currentQuestionIndex].length);
   		disableKeysRepeat(questions[currentQuestionIndex].length); 
		disableKeysNext(questions[currentQuestionIndex].length); 
	}

    function html_header(h_no,text){ 
    	return '<' + h_no + '>' + text + '</' + h_no + '>'; 
    }

    function html_p(text){ 
    	return '<P>' + text + '</P>'; 
    }

    function html_checkbox(id,text){
    	html = '';
    	for (i=0;i<text.length;i++){ 
    		indexed_id = id + '_' + (i+1).toString();
    		html += '<label class="cust_container">' + html_header("H4", text[i]) + '<input class="checkmark"" type="checkbox" id="' + indexed_id + '"> <span class="checkmark"></span> </label>' ; 
    	}
    	return html;
    }

    function html_textbox(id,text){
    	return html_header("H4", text) + '<input type="textbox" id="txt_' + id + '" >';  
    }

    function html_radio(id,text,options){
    	html = html_header("H4", text);  
    	for (i=0;i<options.length;i++){ 
    		indexed_id = id + '_' + (i+1).toString(); 
    		html += '<label class="cust_container">' + html_header("H4", options[i]) + '<input class="checkmark" type="radio" id="rd_' + indexed_id + '" value="' + options[i] + '" name="' + id + '"> <span class="checkmark"></span> </label>';
    	}
    	return html; 
    } 

    function set_consent_agreement(){
    	var script = document.createElement('script'); 
		document.head.appendChild(script);    
		script.type = 'text/javascript';
		script.src = jquery;

    	cur_agreement = configuration.consent.agreements[response.consent.current_agreement]
    	if (cur_agreement.a_type === 'mandatory'){
    		$("#dynamic_title").empty().append(html_header("H3", configuration.consent.mandatory_statement)); 
    		id = "agreement_" + cur_agreement.a_no.toString();
    		$("#dynamic_body").empty().append(html_checkbox(id,[cur_agreement.a_no.toString() + "/" + response.consent.agreements_length.toString() + ") "+ cur_agreement.agreement]));
    		script.onload = function(){
			    $("#" + id + "_1").change(function() {
				    if(this.checked) {
				    	response.consent.agreed.push("Yes, " + configuration.consent.agreements[response.consent.current_agreement].a_no.toString() + ',"' + configuration.consent.agreements[response.consent.current_agreement].agreement + '"');
				    	response.consent.current_agreement ++;
				        set_consent_agreement();
				    }
				});
			}   
    	}
    	else if (cur_agreement.a_type === 'optional'){
    		$("#dynamic_title").empty().append(html_header("H3", configuration.consent.optional_statement)); 
    		id = "agreement_" + cur_agreement.a_no.toString();
    		$("#dynamic_body").empty().append(html_radio(id,cur_agreement.a_no.toString() + "/" + response.consent.agreements_length.toString() + ") "+ cur_agreement.agreement,["Yes", "No"]));
    		script.onload = function(){
			    $('input[type=radio][name="' + id + '"]').change(function() {   
					switch(this.value) {
					        case 'Yes' :
					            response.consent.agreed.push('Yes, ' + configuration.consent.agreements[response.consent.current_agreement].a_no.toString() + ',"' + configuration.consent.agreements[response.consent.current_agreement].agreement + '"');
						    	response.consent.current_agreement ++;
						        set_consent_agreement();
					            break;
					        case 'No' :
					            response.consent.agreed.push('No, ' + configuration.consent.agreements[response.consent.current_agreement].a_no.toString() + ',"' + configuration.consent.agreements[response.consent.current_agreement].agreement + '"');
						    	response.consent.current_agreement ++;
						        set_consent_agreement();
					            break;
					    }   
				}); 
			}   
    	}
    	else{//last agreement
    		$("#dynamic_title").empty();
    		id = "agreement_" + cur_agreement.a_no.toString();
    		$("#dynamic_body").empty().append(html_textbox(id,configuration.consent.sign_statement));
    		$("#dynamic_body").append(html_checkbox(id,[cur_agreement.a_no.toString() + "/" + response.consent.agreements_length.toString() + ") "+ cur_agreement.agreement]));

    		script.onload = function(){
			    $("#" + id + "_1").change(function() {
				    if(this.checked) {
				    	if ($("#txt_" + id).val() === ''){
				    		$("#" + id + "_1").prop("checked", false);
				    		alert('You should fill the sign textbox!');  
				    	}
				    	else{ 
				    		response.consent.agreed.push('Yes, ' + configuration.consent.agreements[response.consent.current_agreement].a_no.toString() + ',"' + configuration.consent.agreements[response.consent.current_agreement].agreement + '"');
				    		response.consent.agreed.push('Yes, sign, "' + $("#txt_" + id).val() + '"');
					    	$("#dynamic_header").empty(); 
					    	$("#dynamic_title").empty();
					    	$("#dynamic_body").empty(); 
					    	$('#dynamic').addClass('hidden');
					    	$('#startAvatarButton').removeClass('hidden').show();
					    	$('#divAlert').removeClass('hidden').show();

					    	ws.send(JSON.stringify({msg:'consent',data:{token:token, agreements:response.consent.agreed}})); 
				    	} 
				    }
				});
			}   
    	}   
    }

    function init_consent(){ 
    	response.consent = {};

    	if (Object.keys(configuration.consent).length === 0){ 
    		init_questions();
    	}
    	else { 
    		response.consent.agreed = ['Agreed, Agreement_No, Agreement'];
    		response.consent.current_agreement = 0;  
    		response.consent.agreements_length = configuration.consent.agreements.length; 
    		
    		$("#dynamic_header").empty().append(html_header('H1', configuration.consent.title));
    		$("#dynamic_header").append(html_header('H2', configuration.consent.participants)); 
    		$("#dynamic_header").append(html_header('H3', configuration.consent.project)); 
    		$("#dynamic_header").append(html_header('H3', configuration.consent.reference)); 
    		$("#dynamic_header").append(html_header('H3', configuration.consent.pi)); 
    		$('#dynamic_header').addClass('bg-info text-white');  
    		
    		set_consent_agreement();

    		$('#dynamic').removeClass('hidden').show(); 
    		$('#startAvatarButton').addClass('hidden'); 
    	} 
    } 

	function init_questions(){

		$('#divAlert').removeClass('alert-danger').addClass('alert-info');
	 	$('#divAlert').text('Press "Start" button to start recording ');

		$('#divQuestionNo').addClass('hidden');
		$('#divQuestionNo').text('');
 
		$('#startAvatarButton').removeClass('hidden').show(); 
		currentQuestionIndex=1;   
	}    

  function startRecording() {  
  	if (currentQuestionIndex > 0 && currentQuestionIndex < maxQuestions){
  		//put value on end of queue
	    queueAudio.push({q_no:currentQuestionIndex, r_no:repeatIndex}); 

  		ws.send(JSON.stringify({msg:'startRecording - ' + currentQuestionIndex.toString() + ' - ' + repeatIndex.toString() ,data:token}));
	     
	    stopRecording();

		mediaRecorder = new MediaRecorder(liveStream, {mimeType: 'video/webm'});
		videoMimeType = mediaRecorder.mimeType;
	  	mediaRecorder.addEventListener('dataavailable', onMediaRecordingReady); 
	  	mediaRecorder.start();  
	  } 
  } 

  function onMediaRecordingReady(e) { 
	  var reader = new FileReader();
		reader.onload = function(event){
			var data = event.target.result.toString('base64');

			if (data.length>1000){
				//Take first value from queue
	            var value = queueAudio.shift();
	            if (value !== undefined){
	            	
		            // send data via the websocket  
		            ws.send(JSON.stringify({msg:'webm',data:{token:token, q_no:value.q_no, r_no:value.r_no, data:data}}));    
	            } 
			}
            
		};
		reader.readAsDataURL(e.data);  
  }  

  function stopRecording() {  
	    mediaRecorder && mediaRecorder.stop();  
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
     
	}

	function processBuffer(e) {
		var cnv = getCanvas();
		var ctx = cnv.getContext('2d')
		var micData = e.inputBuffer.getChannelData(0);
		var height = cnv.height,  width= cnv.width, modifier = 0.125;	
		// clear canvas and draw border
		ctx.strokeStyle='#000000';
		canvasInitialize(width,height);

		
		// draw samples values in green
		ctx.strokeStyle='#00ff00';
		//var average = 0;
		var gain = 100;
		for(var i=0; i<width; i++) {
			var sample1 = modifier * micData[2*i];
			var sample2 = modifier * micData[2*i+1];
			var val = (sample1+sample2)*gain; // combine two samples and multiply by gain
			canvasDrawSquare(i, height/2, i+1, height/2-val); 
		}
		 
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
		  liveStream = stream;
		  video.onloadedmetadata = function(e) {
		    video.play(); 
		  }; 

		  //for wave form
		  onSuccess(stream);

		})
		.catch(function(err) {
		  console.log(err.name + ": " + err.message);
		}); 

	/* initialise */
	if ("WebSocket" in window) { 
         ws = new WebSocket(socket_uri); 
         ws.onopen = function() { 
             // make a token
            token = userID + '-'+ dateTime + '-' + (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();  
            ws.send(JSON.stringify({msg:'token',data:token}));  
         };
         ws.onerror = function (evt) {  
            $('#divAlert').removeClass('alert-danger').addClass('alert-info').text("WebSocket error:" + evt.data).removeClass("hidden");
         };
         ws.onmessage = function (evt) {  
            $('#divAlert').removeClass('alert-danger').addClass('alert-info').text("Message from the server:" + evt.data).removeClass("hidden");
         };
         ws.onclose = function() {
            // websocket is closed. 
			$('#divAlert').removeClass('alert-info').addClass('alert-danger').text('Error: Server connection error!').removeClass("hidden");
			 };
			}
   	else {
         // The browser doesn't support WebSocket 
         $('#divAlert').removeClass('alert-info').addClass('alert-danger').text('Error: WebSocket NOT supported by your Browser!').removeClass("hidden");
    }   
	
	init_consent(); 
}); 
