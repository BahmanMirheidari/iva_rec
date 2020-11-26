$(function() {
    // shared variables 
    var ws = null;
    var token = null;
    var currentQuestionIndex = 0;
    var repeatIndex = 0;
    var record = true;
    var queueAudio = [],
        queueVideo = [];
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    var dateTime = date + '-' + time;
    var videoMimeType;
    var startTime = null;
    var killPreviousTimer = false;
    var buzzers = true;
    var videoHidden = true;
    var nextPressed = false;
    var repeatPressed = false;
    var audio_context;
    var mediaRecorder; 
    var video;
    var chunks;
    var response = {};
    var questions = configuration.questions;
    var maxQuestions = questions.length - 1;
    var startQuestionIndex = 0; // ****** CHANGE THIS TO 0
    var surveyIndex = 0;
    var pre_surveyIndex = 0;
    var questionnaire = 1;
    var dynamic = 'pre_survey';
    var endingMessage = "Thank you. The END.";
    var logoutUrl = "/logout"
    var logoutTimeout = 10000;
    var audioOnlyStream;
    var videoOnlyStream;
    var myAudioRecorder; 

    var MEDIA_RECORDER = true;
    var RECORDING_FLAG = false;
    var RECORDING_CHUNKS = 10 * 1000; //10 sec 
    var startDate; 
    var audio;
    var browser;
    var browser_error = 'Sorry, there is an issue in initialising video/audio in your browser. Preferred browsers are the Google Chrome for Windows/Linux, and Safari for Apple devices (make sure to enable MediaRecorder --On iOS Go to Settings → Safari → Advanced → Experimental Features Enable MediaRecorder; Safari → Preferences → Advanced -- Show Develop menu in menu bar -- Develop → Experimental Features -- Enable MediaRecorder). ';


    function sendAudioVideo(audio = true, start=true, stop=true) { 
    	if (MEDIA_RECORDER){
    		mediaRecorder && mediaRecorder.stop();

    		if (start){
    			mediaRecorder = new MediaRecorder(videoOnlyStream, {mimeType: 'video/webm'}); 
                var script = document.createElement('script');
                document.head.appendChild(script);
                script.type = 'text/javascript';
                //script.src = jquery;

                script.onload = function() {
                    function onMediaRecordingReady(e) { 
                          var reader = new FileReader();
                            reader.onload = function(event){
                                var data = event.target.result.toString('base64');

                                if (data.length>1000){
                                    var time_diff = (new Date().getTime() - startDate.getTime()) / 1000; 
                                    // send data via the websocket  
                                    //alert('webm-audio-chunk' + token + '-' + currentQuestionIndex.toString()+ '-' + repeatIndex.toString()+ '-' + data.length.toString()+ '-' + last.toString());
                                    ws.send(JSON.stringify({
                                        msg: 'video',
                                        data: {
                                            token: token,
                                            time_diff:time_diff.toString(), 
                                            data: data,
                                            ext:"webm"
                                        } 
                                    }));
                                }
                                
                            };
                            reader.readAsDataURL(e.data);  
                     }   
                    mediaRecorder.addEventListener('dataavailable', onMediaRecordingReady);   
                    mediaRecorder.start(); 
                }  
			} 
    	}
    	else{
    		if (audio) {
	            stop && myAudioRecorder && myAudioRecorder.stop(function(blob_audio) {
	                var reader = new FileReader();
	                reader.onload = function(event) {
	                    var data = event.target.result.toString('base64'); 

	                    if (data.length > 100) {
	                    	var time_diff = (new Date().getTime() - startDate.getTime()) / 1000; 
	                        // send data via the websocket  
	                        //alert('webm-audio-chunk' + token + '-' + currentQuestionIndex.toString()+ '-' + repeatIndex.toString()+ '-' + data.length.toString()+ '-' + last.toString());
	                        ws.send(JSON.stringify({
	                            msg: 'audio',
	                            data: {
	                                token: token,
			                        time_diff:time_diff.toString(), 
			                        data: data,
			                        ext: "webm"  
	                            } 
	                        }));
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
	            stop && mediaRecorder && mediaRecorder.stop(function(blob_video) {  
	                var reader = new FileReader();
	                reader.onload = function(event) {
	                    var data = event.target.result.toString('base64'); 

	                    if (data.length > 100) {
	                    	var time_diff = (new Date().getTime() - startDate.getTime()) / 1000; 
	                        // send data via the websocket  
	                        //alert('webm-video-chunk' + token + '-' + currentQuestionIndex.toString()+ '-' + repeatIndex.toString()+ '-' + data.length.toString()+ '-' + last.toString());
	                        ws.send(JSON.stringify({
	                            msg: 'video',
	                            data: {
	                                token: token,
	                                time_diff:time_diff.toString(), 
			                        data: data,
			                        ext: "webm"  
	                            } 
	                        }));
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

    function detectOSBrowser(){
    	var OSName="Unknown OS";
    	var mobile="No";
    	var nVer = navigator.appVersion;
		var nAgt = navigator.userAgent;
		var browserName  = navigator.appName;
		var fullVersion  = ''+parseFloat(navigator.appVersion);  
		var nameOffset,verOffset,ix;

		if (nVer.indexOf("Win")!=-1) OSName="Windows";
		if (nVer.indexOf("Mac")!=-1) OSName="MacOS";
		if (nVer.indexOf("X11")!=-1) OSName="UNIX";
		if (nVer.indexOf("Linux")!=-1) OSName="Linux";

		if (nAgt.match(/BlackBerry/i)) OSName="BlackBerry";
		if (nAgt.match(/Android/i)) OSName="Android";
		if (nAgt.match(/iPhone|iPad|iPod/i)) OSName="iOS";
		if (nAgt.match(/Opera Mini/i)) OSName="Opera";
		if (nAgt.match(/IEMobile/i)) OSName="IEMobile"; 

		// In Opera, the true version is after "Opera" or after "Version"
		if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
		 browserName = "Opera";
		 fullVersion = nAgt.substring(verOffset+6);
		 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
		   fullVersion = nAgt.substring(verOffset+8);
		}
		// In MSIE, the true version is after "MSIE" in userAgent
		else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
		 browserName = "MSIE";
		 fullVersion = nAgt.substring(verOffset+5);
		}
		// In Chrome, the true version is after "Chrome" 
		else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
		 browserName = "Chrome";
		 fullVersion = nAgt.substring(verOffset+7);
		}
		// In Safari, the true version is after "Safari" or after "Version" 
		else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
		 browserName = "Safari";
		 fullVersion = nAgt.substring(verOffset+7);
		 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
		   fullVersion = nAgt.substring(verOffset+8);
		}
		// In Firefox, the true version is after "Firefox" 
		else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
		 browserName = "Firefox";
		 fullVersion = nAgt.substring(verOffset+8);
		}
		// In most other browsers, "name/version" is at the end of userAgent 
		else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
		          (verOffset=nAgt.lastIndexOf('/')) ) 
		{
		 browserName = nAgt.substring(nameOffset,verOffset);
		 fullVersion = nAgt.substring(verOffset+1);
		 if (browserName.toLowerCase()==browserName.toUpperCase()) {
		  browserName = navigator.appName;
		 }
		}
		// trim the fullVersion string at semicolon/space if present
		if ((ix=fullVersion.indexOf(";"))!=-1)
		   fullVersion=fullVersion.substring(0,ix);
		if ((ix=fullVersion.indexOf(" "))!=-1)
		   fullVersion=fullVersion.substring(0,ix); 

		all_details ='os:'+OSName+ ', browser:' +browserName+', fullVersion:'+fullVersion+', appName:'+navigator.appName+', userAgent:'+navigator.userAgent  

		return {'all_details':all_details, 'os':OSName, 'browser':browserName, 'fullVersion':fullVersion, 'appName':navigator.appName, 'userAgent':navigator.userAgent}  
    }

    function initialiseAudioVideo(callback){
    	// for safari or iOS
    	osBr = detectOSBrowser();
        if (osBr.browser.match(/Safari/i) && (osBr.os.match(/iOS|MacOS/i))){
            MEDIA_RECORDER = false; 
        }  

    	//webcam
    	var videoWebcam = document.querySelector('video'); 
    	videoWebcam.setAttribute('autoplay', '');
	    videoWebcam.setAttribute('muted', '');
	    videoWebcam.setAttribute('playsinline', ''); 

        
	    if (MEDIA_RECORDER){
	    	navigator.mediaDevices.getUserMedia({
	                audio: true, video: true
	            })
	            .then(function(stream) {
	            	displayWaveForm(stream); 

	                //webcam
	                var videoWebcam = document.querySelector('video');

	                // Older browsers may not have srcObject
	                if ("srcObject" in videoWebcam) {
	                    videoWebcam.srcObject = stream; 
	                } else {
	                    // Avoid using this in new browsers, as it is going away.
	                    videoWebcam.src = window.URL.createObjectURL(stream);
	                }

	                videoWebcam.play();

	                //video
	                videoOnlyStream = stream;
	                videoWebcam.onloadedmetadata = function(e) {
	                    videoWebcam.play();
	                }; 

	                // send each RECORDING_CHUNKS sec
	                setInterval(function() { 
	                	if (currentQuestionIndex > 0 && currentQuestionIndex <= maxQuestions && RECORDING_FLAG) {
		                    sendAudioVideo(audio = false);	
		                }

	                }, RECORDING_CHUNKS);

	                callback(null);
	            })
	            .catch(function(err) {
                    er = browser_error + "-- Error details: video (getUserMedia): --" + err.name + "--" + err.message;
	                console.log(er);
	                callback(er);
	            });   
    	}
    	else{ 
	    	navigator.mediaDevices.getUserMedia({
	                video: true
	            })
	            .then(function(stream) {
	                //webcam
	                var videoWebcam = document.querySelector('video');

	                // Older browsers may not have srcObject
	                if ("srcObject" in videoWebcam) {
	                    videoWebcam.srcObject = stream; 
	                } else {
	                    // Avoid using this in new browsers, as it is going away.
	                    videoWebcam.src = window.URL.createObjectURL(stream);
	                }

	                videoWebcam.play();

	                //video
	                videoOnlyStream = stream;
	                videoWebcam.onloadedmetadata = function(e) {
	                    videoWebcam.play();
	                }; 

	                // send each RECORDING_CHUNKS sec
	                setInterval(function() { 
	                	if (currentQuestionIndex > 0 && currentQuestionIndex <= maxQuestions && RECORDING_FLAG) {
		                    sendAudioVideo(audio = false);	
		                }

	                }, RECORDING_CHUNKS);

	                navigator.mediaDevices.getUserMedia({
			                audio: true
			            })
			            .then(function(stream) {
			                //video
			                audioOnlyStream = stream;

			                //for wave form
			                displayWaveForm(audioOnlyStream); 

			                // send each RECORDING_CHUNKS sec
			                setInterval(function() {
			                	if (currentQuestionIndex > 0 && currentQuestionIndex <= maxQuestions && RECORDING_FLAG) {
				                    sendAudioVideo(audio = true);
				                }

			                }, RECORDING_CHUNKS);  

			                callback(null);
			        
			            })
			            .catch(function(err) {
			                console.log(err.name + "audio (getUserMedia): " + err.message);
			                callback(err.name + "audio (getUserMedia): " + err.message);
			            }); 

	            })
	            .catch(function(err) { 
                    er = browser_error + "-- Error details: video-audio (getUserMedia): --" + err.name + "--" + err.message;
                    console.log(er);
                    callback(er);
	            });   
    	}  
    }

    // start Avatar Button, introduces the interview
    $("#startAvatarButton").click(function() {  
    	document.getElementById("audio").play(); 

        $("#consent").addClass('hidden');

        currentQuestionIndex = startQuestionIndex;
        $("#startAvatarButton").hide();
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
    $("#nextMessageButton").click(function() {
        $('#divStopWatch').removeClass('alert-danger').addClass('alert-warning').addClass('hidden');
        //increment index
        currentQuestionIndex++;
        repeatIndex = 0;

        disableButtonRN();

        //start recording
        startRecording();

        if (currentQuestionIndex == maxQuestions) {

            playQuestion();
            if (MEDIA_RECORDER) {
                    sendAudioVideo(audio = true, start=false); 
            }
            else{
                sendAudioVideo(audio = false, start=false);
                sendAudioVideo(audio = true, start=false);
            }   

            setTimeout(function() {
                $("#divVideo").hide();
                $('#mycanvas').hide();
                $("#repeatMessageButton").hide();
                $("#nextMessageButton").hide();
                var videoWebcam = document.querySelector('video');  
                videoWebcam.pause();
                videoWebcam.src = ""; 

                if (MEDIA_RECORDER) {
                    sendAudioVideo(audio = true, start=false);
                	videoOnlyStream.getTracks()[0].stop();
                	videoOnlyStream.getTracks()[1].stop();
                }
                else{
                	videoOnlyStream.getTracks()[0].stop();
                	audioOnlyStream.getTracks()[0].stop();
                }    

                init_survey();

                $('#divAlert').hide();

            }, questions[currentQuestionIndex].length);

            return false;
        } else
            //play current question
            playQuestion();

        return false;
    });

    // repeat Message Button
    $("#repeatMessageButton").click(function() {
        repeatIndex++; 

        disableButtonRN();
        //start recording
        startRecording();

        //play current question
        playQuestion();
        return false;
    });

    //listen to keys
    $(document).keydown(function(event) {

        //spacebar pressed for next
        if (event.which === 32 && repeatPressed === false) {
            if ($("#startAvatarButton").is(':hidden'))
                $("#repeatMessageButton").trigger('click');
            else
                $("#startAvatarButton").trigger('click');
        }
        //backspace pressed for repeat
        else if (event.which === 13 && nextPressed === false) {
            if ($("#startAvatarButton").is(':hidden'))
                $("#nextMessageButton").trigger('click');
            else
                $("#startAvatarButton").trigger('click');
        }
    });

    // random number generator
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    //start stop watch
    function startStopWatch() {
        var date = new Date();
        startTime = date.getTime();
    }

    //stop stop watch
    function stopStopWatch() {
        if (startTime == null)
            return;
        startTime = null;
    }

    //get stop watch time (format 00:00)
    function getStopWatch() {
        var date = new Date();
        if (startTime == null)
            sec = 0;
        else
            sec = parseInt((date.getTime() - startTime) / 1000);

        var hours = Math.floor(sec / 3600);
        var minutes = Math.floor((sec - (hours * 3600)) / 60);
        var seconds = sec - (hours * 3600) - (minutes * 60);

        //if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ':' + seconds;
    }

    function displayTimer(reps, delay) {
        $('#divStopWatch').removeClass('alert-danger').addClass('alert-warning');
        $('#divStopWatch').text('Timer ' + getStopWatch());
        if (killPreviousTimer == true)
            return;
        if (reps >= 0)
            setTimeout(function() {
                displayTimer(reps - 1, delay);
            }, delay);
        else {
            stopStopWatch();
            $('#divStopWatch').removeClass('alert-warning').addClass('alert-danger');
            $('#divStopWatch').text('End');
        }
    }

    function killTimer(delay) {
        killPreviousTimer = true;
        setTimeout(function() {
            killPreviousTimer = false;
        }, delay);
    }

    function displayStopWatch(initDelay, seconds, displayIntervals) {
        //kill previous timer first in case it is running
        killTimer(initDelay);

        setTimeout(function() {
            $('#divStopWatch').removeClass('hidden');
            $('#divStopWatch').show()
            startStopWatch();
            //60 seconds timer
            displayTimer(seconds, displayIntervals);

        }, initDelay);
    }

    function convertToBool(value) {
        value = value === 'true' ? true : false;
        return value;
    }

    function pause(milliseconds) {
        var dt = new Date();
        while ((new Date()) - dt <= milliseconds) {
            /* Do nothing */ }
    }

    //play avatar
    function playAvatar() {
        if (videoHidden == true) {
            $("#divVideo").removeClass('hidden');
            videoHidden = false;
        }

        var video = document.getElementById("videoMp4");

        video.src = questions[currentQuestionIndex].video_url;
        video.play();

        var delay = 0;
        if (currentQuestionIndex > 0)
            delay += (questions[currentQuestionIndex].length - 60000);

        if (questions[currentQuestionIndex].play_buzzer) {
            setTimeout(function() {
                playBuzzers(100, 60000);

            }, delay);
            displayStopWatch(delay, 60, 1000);
        }
        if (questions[currentQuestionIndex].show_text) {
            $('#divPar').removeClass('hidden').show();
            $('#divMessage').empty().append(html_header("H3", questions[currentQuestionIndex].text, "150"));
        } else {
            $('#divPar').addClass('hidden');
        }

        $("#divDescriptionImage").addClass('hidden');
        if (questions[currentQuestionIndex].image_url !== '') {
            $("#imgDescription").attr("src", questions[currentQuestionIndex].image_url + `?v=${new Date().getTime()}`);
            $("#divDescriptionImage").removeClass('hidden');
        }
    }

    //disable enter and space keys for a while
    function disableKeysNext(intervals) {
        nextPressed = true;
        setTimeout(function() {
            nextPressed = false;
        }, intervals);
    }

    function disableKeysRepeat(intervals) {
        repeatPressed = true;
        setTimeout(function() {
            repeatPressed = false;
        }, intervals);
    } 

    //play audio
    function playSound(soundfile) {   
    	//audio = new Audio(soundfile);  
		//audio.play(); 
		audio = document.getElementById("audio");
		audio.load();
		audio.src=soundfile;
		audio.play();
    }

    //plays the current question 
    function playQuestion() {
        if (currentQuestionIndex == maxQuestions) {
            $('#divQuestionNo').hide();

            $('#divAlert').hide();

        } else if (currentQuestionIndex > 0) {
            $('#divQuestionNo').removeClass('hidden');
            $('#divQuestionNo').text('Question ' + (currentQuestionIndex).toString() + '/' + (maxQuestions - 1).toString());
        }
        stopStopWatch();

        playAvatar();
    }

    function playBuzzers(initialDelay, buzzerInterval) {
        var intervals = initialDelay + buzzerInterval;
        setTimeout(function() {
            playSound('Buzzer/Buzzer1.mp3');

            setTimeout(function() {
                playSound('Buzzer/Buzzer1.mp3');

            }, buzzerInterval);

        }, initialDelay);
    }

    function autoClickNext(interval) {
        setTimeout(function() {
            $('#nextMessageButton').trigger('click');
        }, interval);
    }

    //disable the button for a while
    function disableButton(btn, delay) {
        btn.prop('disabled', true);
        btn.addClass('disabledButton');
        btn.hide();
        $('#divStopWatch').hide();
        setTimeout(function() {
            btn.prop('disabled', false);
            btn.show();
            btn.removeClass('disabledButton');
            $('#divStopWatch').hide();
        }, delay);
    }

    function disableButtonRN() {
        killTimer(3);
        disableButton($("#repeatMessageButton"), questions[currentQuestionIndex].length);
        disableButton($("#nextMessageButton"), questions[currentQuestionIndex].length);
        disableKeysRepeat(questions[currentQuestionIndex].length);
        disableKeysNext(questions[currentQuestionIndex].length);
    }

    function html_header(h_no, text, font_size = "200", padding_left = "20") {
        return '<' + h_no + ' style="font-size: ' + font_size + '%;padding-left: ' + padding_left + 'px;">' + text + '</' + h_no + '>';
    }

    function html_p(text) {
        return '<P>' + text + '</P>';
    }

    function html_checkbox(id, text) {
        html = '';
        for (i = 0; i < text.length; i++) {
            indexed_id = id + '_' + (i + 1).toString();
            html += '<label class="cust_container">' + html_header("H4", text[i]) + '<input class="checkmark"" type="checkbox" id="' + indexed_id + '"> <span class="checkmark"></span> </label>';
        }
        return html;
    }

    function html_textbox(id, text, font_size = "200") {
        return html_header("H4", text) + '<input type="textbox" id="txt_' + id + '" style="font-size: ' + font_size + '%;" >';
    }

    function html_radio(id, text, options, idx = -1) {
        html = html_header("H4", text);
        for (i = 0; i < options.length; i++) {
            indexed_id = id + '_' + (i + 1).toString();
            var checked = '';
            if (idx == i)
                checked = "checked"
            html += '<label class="cust_container">' + html_header("H4", options[i]) + '<input class="checkmark" type="radio" id="rd_' + indexed_id + '" value="' + options[i] + '" name="' + id + '" ' + checked + '> <span class="checkmark"></span> </label>';
        }
        return html;
    }

    // nextSurvey Button
    $("#nextSurveyButton").click(function() {
        if (dynamic == 'consent') {
            if (response.consent.current_agreement < response.consent.current_agreement.questions_length - 1) {
                response.consent.current_agreement++;
                set_consent_agreement();
            } else {
                ws.send(JSON.stringify({
                    msg: 'consent',
                    data: {
                        token: token,
                        agreements: response.consent.agreed
                    } 
                }));
                init_pre_surveys();

                $("#dynamic_header").empty();
                $("#dynamic_title").empty();
                $("#dynamic_body").empty();
                $('#dynamic').addClass('hidden');
            }

            if (response.consent.current_agreement > 0)
                $('#backSurveyButton').prop('disabled', false);
        } else if (dynamic == 'survey') {
            if (response.surveys[surveyIndex].current_question < response.surveys[surveyIndex].questions_length - 1) {
                response.surveys[surveyIndex].current_question++;
                set_survey(function(err, msg) {
                    if (response.surveys[surveyIndex].current_question > 0)
                        $('#backSurveyButton').prop('disabled', false);
                });
            } else {
                ws.send(JSON.stringify({
                    msg: 'survey',
                    data: {
                        token: token,
                        id: configuration.surveys[surveyIndex].id,
                        questions: response.surveys[surveyIndex].question
                    }  
                }));
                surveyIndex++;
                questionnaire++;
                if (surveyIndex >= configuration.surveys.length)
                    end_message();
                else {
                    init_survey();
                }
            }
        } else if (dynamic == 'pre_survey') {
            if (response.pre_surveys[pre_surveyIndex].current_question < response.pre_surveys[pre_surveyIndex].questions_length - 1) {
                response.pre_surveys[pre_surveyIndex].current_question++;
                set_pre_survey(function(err, msg) {
                    if (response.pre_surveys[pre_surveyIndex].current_question > 0)
                        $('#backSurveyButton').prop('disabled', false);
                });
            } else {
                ws.send(JSON.stringify({
                    msg: 'survey',
                    data: {
                        token: token,
                        id: configuration.pre_surveys[pre_surveyIndex].id,
                        questions: response.pre_surveys[pre_surveyIndex].question
                    }   
                }));
                pre_surveyIndex++;
                questionnaire++;
                if (pre_surveyIndex >= configuration.pre_surveys.length) {
                    $('#dynamic').addClass('hidden');
                    init_questions();
                } else {
                    init_pre_surveys();
                }
            }
        }

        return false;
    });

    // backSurvey Button
    $("#backSurveyButton").click(function() {
        if (dynamic == 'consent') {
            response.consent.current_agreement

            if (response.consent.current_agreement > 0) {
                response.consent.current_agreement--;
                set_consent_agreement();
            }
            if (response.consent.current_question == 0)
                $('#backSurveyButton').prop('disabled', true);
        } else if (dynamic == 'survey') {
            if (response.surveys[surveyIndex].current_question > 0) {
                response.surveys[surveyIndex].current_question--;
                set_survey(function(err, msg) {
                    if (response.surveys[surveyIndex].current_question == 0)
                        $('#backSurveyButton').prop('disabled', true);
                });
            }
        } else if (dynamic == 'pre_survey') {
            if (response.pre_surveys[pre_surveyIndex].current_question > 0) {
                response.pre_surveys[pre_surveyIndex].current_question--;
                set_pre_survey(function(err, msg) {
                    if (response.pre_surveys[pre_surveyIndex].current_question == 0)
                        $('#backSurveyButton').prop('disabled', true);
                });
            }
        }

        return false;
    });

    function set_survey(callback) {
        cur_question = configuration.surveys[surveyIndex].questions[response.surveys[surveyIndex].current_question];
        var idx = 0;
        var answer = response.surveys[surveyIndex].question[response.surveys[surveyIndex].current_question + 1];
        if (answer !== '') {
            var strs = answer.split(",");
            answer = strs[0].replace(/"/g, '');
            idx = cur_question.answers.values.indexOf(answer);
        }
        var id = "answer_survey_" + (surveyIndex).toString() + '-' + cur_question.q_no.toString();
        $("#dynamic_body").empty().append(html_radio(id, cur_question.q_no.toString() + "/" + response.surveys[surveyIndex].questions_length.toString() + ") " + cur_question.text, cur_question.answers.values, idx));

        var script = document.createElement('script');
        document.head.appendChild(script);
        script.type = 'text/javascript';
        script.src = jquery;

        script.onload = function() {
            $('input[type=radio][name="' + id + '"]').change(function() {
                response.surveys[surveyIndex].question[cur_question.q_no] = '"' + this.value + '", ' + cur_question.q_no.toString() + ',"' + configuration.surveys[surveyIndex].questions[cur_question.q_no - 1].text + '"';
            });
        }
        callback(null, 'completed');
    }

    function end_message() {
        $('#dynamic').hide();
        $('#divPar').removeClass('hidden').show();
        $('#divMessage').text(endingMessage);

        setTimeout(function() {
            window.location = logoutUrl;
        }, logoutTimeout);
    }

    function init_survey() {
        dynamic = 'survey';
        if (configuration.surveys.length == 0) {
            end_message();
        } else {
            response.surveys[surveyIndex] = {};
            response.surveys[surveyIndex].question = ['Answer, Question_No, Question'];
            response.surveys[surveyIndex].current_question = 0;
            response.surveys[surveyIndex].questions_length = configuration.surveys[surveyIndex].questions.length;
            for (var i = 0; i < response.surveys[surveyIndex].questions_length; i++) {
                response.surveys[surveyIndex].question.push('"' + configuration.surveys[surveyIndex].questions[i].answers.values[0] + '", ' + (i + 1).toString() + ',"' + configuration.surveys[surveyIndex].questions[i].text + '"');
            }

            set_survey(function(err, msg) {
                $("#dynamic_header").empty().append(html_header('H1', 'Questionnaire ' + questionnaire.toString(), '400'));
                $("#dynamic_header").append(html_header('H2', configuration.surveys[surveyIndex].title, '300'));
                $("#dynamic_header").append(html_header('H2', configuration.surveys[surveyIndex].comment, '300'));
                $("#dynamic_header").append(html_header('H3', configuration.surveys[surveyIndex].main_q, '300'));
                $('#dynamic_header').addClass('bg-info text-white');
                $('#dynamic').removeClass('hidden').show();
                $('#backSurveyButton').removeClass('hidden').show();
                $('#nextSurveyButton').removeClass('hidden').show();
                $('#backSurveyButton').prop('disabled', true);
            });
        }
    }

    function set_pre_survey(callback) {
        cur_question = configuration.pre_surveys[pre_surveyIndex].questions[response.pre_surveys[pre_surveyIndex].current_question];
        var idx = 0;
        var answer = response.pre_surveys[pre_surveyIndex].question[response.pre_surveys[pre_surveyIndex].current_question + 1];
        if (answer !== '') {
            var strs = answer.split(",");
            answer = strs[0].replace(/"/g, '');
            idx = cur_question.answers.values.indexOf(answer);
        }
        var id = "answer_pre_survey_" + (pre_surveyIndex).toString() + '-' + cur_question.q_no.toString();
        $("#dynamic_body").empty().append(html_radio(id, cur_question.q_no.toString() + "/" + response.pre_surveys[pre_surveyIndex].questions_length.toString() + ") " + cur_question.text, cur_question.answers.values, idx));

        var script = document.createElement('script');
        document.head.appendChild(script);
        script.type = 'text/javascript';
        script.src = jquery;

        script.onload = function() {
            $('input[type=radio][name="' + id + '"]').change(function() {
                response.pre_surveys[pre_surveyIndex].question[cur_question.q_no] = '"' + this.value + '", ' + cur_question.q_no.toString() + ',"' + configuration.pre_surveys[pre_surveyIndex].questions[cur_question.q_no - 1].text + '"';
            });
        }

        callback(null, 'completed');
    }

    function init_pre_surveys() {
        dynamic = 'pre_survey';
        if (configuration.pre_surveys.length == 0) {
            init_questions();
        } else {
            response.pre_surveys[pre_surveyIndex] = {};
            response.pre_surveys[pre_surveyIndex].question = ['Answer, Question_No, Question'];
            response.pre_surveys[pre_surveyIndex].current_question = 0;
            response.pre_surveys[pre_surveyIndex].questions_length = configuration.pre_surveys[pre_surveyIndex].questions.length;

            for (var i = 0; i < response.pre_surveys[pre_surveyIndex].questions_length; i++) {
                response.pre_surveys[pre_surveyIndex].question.push('"' + configuration.pre_surveys[pre_surveyIndex].questions[i].answers.values[0] + '", ' + (i + 1).toString() + ',"' + configuration.pre_surveys[pre_surveyIndex].questions[i].text + '"');
            }

            set_pre_survey(function(err, msg) {
                $("#dynamic_header").empty().append(html_header('H1', 'Questionnaire ' + questionnaire.toString(), '400'));
                $("#dynamic_header").append(html_header('H2', configuration.pre_surveys[pre_surveyIndex].title, '300'));
                $("#dynamic_header").append(html_header('H2', configuration.pre_surveys[pre_surveyIndex].comment, '300'));
                $("#dynamic_header").append(html_header('H3', configuration.pre_surveys[pre_surveyIndex].main_q, '300'));
                $('#dynamic_header').addClass('bg-info text-white');
                $('#dynamic').removeClass('hidden').show();
                $('#backSurveyButton').removeClass('hidden').show();
                $('#nextSurveyButton').removeClass('hidden').show();
            });
        }
    }

    function set_consent_agreement() {
        var script = document.createElement('script');
        document.head.appendChild(script);
        script.type = 'text/javascript';
        script.src = jquery;

        cur_agreement = configuration.consent.agreements[response.consent.current_agreement]
        if (cur_agreement.a_type === 'mandatory') {
            $("#dynamic_title").empty().append(html_header("H3", configuration.consent.mandatory_statement));
            id = "agreement_" + cur_agreement.a_no.toString();
            $("#dynamic_body").empty().append(html_checkbox(id, [cur_agreement.a_no.toString() + "/" + response.consent.agreements_length.toString() + ") " + cur_agreement.agreement]));
            script.onload = function() {
                $("#" + id + "_1").change(function() {
                    if (this.checked) {
                        response.consent.agreed.push("Yes, " + configuration.consent.agreements[response.consent.current_agreement].a_no.toString() + ',"' + configuration.consent.agreements[response.consent.current_agreement].agreement + '"');
                        response.consent.current_agreement++;
                        set_consent_agreement();
                    }
                });
            }
        } else if (cur_agreement.a_type === 'optional') {
            $("#dynamic_title").empty().append(html_header("H3", configuration.consent.optional_statement));
            id = "agreement_" + cur_agreement.a_no.toString();
            $("#dynamic_body").empty().append(html_radio(id, cur_agreement.a_no.toString() + "/" + response.consent.agreements_length.toString() + ") " + cur_agreement.agreement, ["Yes", "No"]));
            script.onload = function() {
                $('input[type=radio][name="' + id + '"]').change(function() {
                    switch (this.value) {
                        case 'Yes':
                            response.consent.agreed.push('Yes, ' + configuration.consent.agreements[response.consent.current_agreement].a_no.toString() + ',"' + configuration.consent.agreements[response.consent.current_agreement].agreement + '"');
                            response.consent.current_agreement++;
                            set_consent_agreement();
                            break;
                        case 'No':
                            response.consent.agreed.push('No, ' + configuration.consent.agreements[response.consent.current_agreement].a_no.toString() + ',"' + configuration.consent.agreements[response.consent.current_agreement].agreement + '"');
                            response.consent.current_agreement++;
                            set_consent_agreement();
                            break;
                    }
                });
            }
        } else { //last agreement
            $("#dynamic_title").empty();
            id = "agreement_" + cur_agreement.a_no.toString();
            $("#dynamic_body").empty().append(html_textbox(id, configuration.consent.sign_statement));
            $("#dynamic_body").append(html_checkbox(id, [cur_agreement.a_no.toString() + "/" + response.consent.agreements_length.toString() + ") " + cur_agreement.agreement]));

            script.onload = function() {
                $("#" + id + "_1").change(function() {
                    if (this.checked) {
                        if ($("#txt_" + id).val() === '') {
                            $("#" + id + "_1").prop("checked", false);
                            alert('You should fill the sign textbox!');
                        } else {
                            response.consent.agreed.push('Yes, ' + configuration.consent.agreements[response.consent.current_agreement].a_no.toString() + ',"' + configuration.consent.agreements[response.consent.current_agreement].agreement + '"');
                            response.consent.agreed.push('Yes, sign, "' + $("#txt_" + id).val() + '"');
                            ws.send(JSON.stringify({
                                msg: 'consent',
                                data: {
                                    token: token,
                                    agreements: response.consent.agreed
                                }    
                            }));

                            $("#dynamic_header").empty();
                            $("#dynamic_title").empty();
                            $("#dynamic_body").empty();
                            $('#dynamic').addClass('hidden');

                            init_pre_surveys();
                        }
                    }
                });
            }
        }
    }

    function init_consent() {
    	//{'os':OSName, 'browser':browserName, 'fullVersion':fullVersion, 'appName':navigator.appName, 'userAgent':navigator.userAgent}  
    	//var osDetails = detectOSBrowser();
    	//alert("browserName:" + osDetails.browser + " ,os:" +osDetails.os + ', all-' +osDetails.all_details)
    	 
        response.consent = {};
        response.pre_surveys = [];
        response.surveys = [];

        if (Object.keys(configuration.consent).length === 0) {
            init_pre_surveys();
        } else {
            response.consent.agreed = ['Agreed, Agreement_No, Agreement'];
            response.consent.current_agreement = 0;
            response.consent.agreements_length = configuration.consent.agreements.length;

            $("#dynamic_header").empty().append(html_header('H1', configuration.consent.title, '400'));
            $("#dynamic_header").append(html_header('H2', configuration.consent.participants, '300'));
            $("#dynamic_header").append(html_header('H3', configuration.consent.project, '200'));
            $("#dynamic_header").append(html_header('H3', configuration.consent.reference, '200'));
            $("#dynamic_header").append(html_header('H3', configuration.consent.pi, '200'));
            $('#dynamic_header').addClass('bg-info text-white');

            set_consent_agreement();

            $('#dynamic').removeClass('hidden').show();
            $('#startAvatarButton').addClass('hidden');
            $('#backSurveyButton').addClass('hidden');
            $('#nextSurveyButton').addClass('hidden');
        }
    }

    function init_questions() {
        if (Object.keys(configuration.questions).length == 0) {
            init_survey();
        } else {  
            initialiseAudioVideo(function(e){
            	if (e){
                    ws.send(JSON.stringify({
                        msg: 'error',
                        data: {
                            token: token,
                            error:e
                        } 
                    }));

            		$('#divAlert').removeClass('alert-info').addClass('alert-danger').text("Error in initialising Audio/Video recording! - "+e).removeClass("hidden");  
            	}
            	else{
            		 $('#divAlert').removeClass('hidden');
		            $('#divAlert').text('Press "Start" button to start recording ');

		            $('#divQuestionNo').addClass('hidden');
		            $('#divQuestionNo').text('');

		            $('#startAvatarButton').removeClass('hidden').show(); 
            	}  
            });
            //currentQuestionIndex=1;  
        }
    } 

/*
    function onMediaRecordingReady(e) { 
		  var reader = new FileReader();
			reader.onload = function(event){
				var data = event.target.result.toString('base64');

				if (data.length>1000){
					var time_diff = (new Date().getTime() - startDate.getTime()) / 1000; 
	                // send data via the websocket  
	                //alert('webm-audio-chunk' + token + '-' + currentQuestionIndex.toString()+ '-' + repeatIndex.toString()+ '-' + data.length.toString()+ '-' + last.toString());
	                ws.send(JSON.stringify({
	                    msg: 'video',
	                    data: {
	                        token: token,
	                        time_diff:time_diff.toString(), 
	                        data: data,
	                        ext:"webm"
	                    } 
	                }));
				}
	            
			};
			reader.readAsDataURL(e.data);  
	 }*/

    function startRecording() {
        if (currentQuestionIndex > 0 && currentQuestionIndex <= maxQuestions) { 
        	if (RECORDING_FLAG == false){
                RECORDING_FLAG = true;

                if (MEDIA_RECORDER){ 
                    sendAudioVideo(audio = false, start=true, stop=false);
                }
                else{
                	sendAudioVideo(audio = true, start=true, stop=false);
                    sendAudioVideo(audio = false, start=true, stop=false);
                } 

                startDate = new Date(); 
            }

            var time_diff = (new Date().getTime() - startDate.getTime()) / 1000;
        	ws.send(JSON.stringify({
        		msg:'segment', 
        		data:{
        			q_no: currentQuestionIndex.toString(), 
	        		r_no: repeatIndex.toString(),
	        		token: token, 
	        		time_diff: time_diff.toString() 
        		} 
        	}));  
        } else {
            RECORDING_FLAG = false;
            sendAudioVideo(audio = false, start=false);
            sendAudioVideo(audio = true, start=false);
        }
    } 

    function stopRecording() {
        //mediaRecorder && mediaRecorder.stop();
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
        getCanvas().getContext('2d').clearRect(0, 0, width, height);
        canvasDrawSquare(0, 0, width, height);
    } 

    function displayWaveForm(stream) {
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
        var height = cnv.height,
            width = cnv.width,
            modifier = 0.125;
        // clear canvas and draw border
        ctx.strokeStyle = '#000000';
        canvasInitialize(width, height);


        // draw samples values in green
        ctx.strokeStyle = '#00ff00';
        //var average = 0;
        var gain = 100;
        for (var i = 0; i < width; i++) {
            var sample1 = modifier * micData[2 * i];
            var sample2 = modifier * micData[2 * i + 1];
            var val = (sample1 + sample2) * gain; // combine two samples and multiply by gain
            canvasDrawSquare(i, height / 2, i + 1, height / 2 - val);
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

    /* initialise */
    if ("WebSocket" in window) {
        ws = new WebSocket(socket_uri);
        ws.onopen = function() {
            // make a token
            token = userID + '-' + dateTime + '-' + (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

            // for safari or iOS
            osBr = detectOSBrowser();
            browser = osBr.all_details; 
            $.getJSON('https://ipapi.co/json/', function(d) {
                if(d){ 
                    browser += ', ip:'+d.ip + ', country:' + d.country_name + ', region:' + d.region + ', postcode:' + d.postal + ', city:' + d.city + ', timezone:' + d.timezone + ', latitude:' + d.latitude+ ', longitude:' + d.longitude;

                    //alert(JSON.stringify(d, null, 2));
                    ws.send(JSON.stringify({
                        msg: 'token',
                        data: token, 
                        browser:browser, 
                    }));  
                }
                else{
                    browser += ', ip:NA';
                    ws.send(JSON.stringify({
                        msg: 'token',
                        data: token, 
                        browser:browser 
                    }));   
                } 
            });  


        };
        ws.onerror = function(evt) {
            $('#divAlert').removeClass('alert-danger').addClass('alert-info').text("WebSocket error:" + evt.data).removeClass("hidden");
        };
        ws.onmessage = function(evt) {
            $('#divAlert').removeClass('alert-danger').addClass('alert-info').text("Message from the server:" + evt.data).removeClass("hidden");
        };
        ws.onclose = function() {
            // websocket is closed. 
            $('#divAlert').removeClass('alert-info').addClass('alert-danger').text('Error: Server connection error!').removeClass("hidden");
        };
    } else {
        // The browser doesn't support WebSocket 
        $('#divAlert').removeClass('alert-info').addClass('alert-danger').text('Error: WebSocket NOT supported by your Browser!').removeClass("hidden");
    }

    init_consent();   
});