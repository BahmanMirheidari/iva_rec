// config/shared_conf.js

module.exports = { 
    'consent_mc': {
        'image_url' :'Images/logo.png',
        'title' : 'Informed Consent Form',
        'participants': 'Individual with Memory Complaints',
        'project': 'CognoSpeak: An automated cognitive assessment tool based on language (utilising automated speech recognition and Machine Learning)',
        'reference': 'Study Reference: STH20818',
        'pi': 'Principal Investigator: Dr Daniel Blackburn',
        'mandatory_statement': 'Please tick the box for each statement to indicate that you agree:',
        'optional_statement': 'For the following statements, please respond with either YES or NO:',
        'sign_statement': 'Please type your name below to sign this consent form then click submit',
        'agreements': [
            {
                'a_no':1,
                'a_type': 'mandatory',
                'agreement': "I confirm that I have read and understand the Information Sheet (V1, Date: ) for the above study and had an opportunity to ask questions."
            },
            {
                'a_no':2,
                'a_type': 'mandatory',
                'agreement': "I have had the opportunity to consider the information, ask questions and have had these answered satisfactorily."
            },
            {
                'a_no':3,
                'a_type': 'mandatory',
                'agreement': "I understand that my participation is voluntary and that I am free to withdraw at any time, without giving any reason, without my medical care or rights being affected."
            },
            {
                'a_no':4,
                'a_type': 'mandatory',
                'agreement': "I understand that relevant sections of my medical notes and the data collected during the study may be looked at by individuals from regulatory authorities, Sheffield Teaching Hospitals NHS Foundation Trust, Sheffield Health and Social Care NHS Foundation Trust, the University of Sheffield, where it is relevant to my taking part in this research. I give permission for such individuals to have access to my records."
            },
            {
                'a_no':5,
                'a_type': 'mandatory',
                'agreement': "I agree that the consultations between me and CognoSpeak can be audio-recorded."
            },
            {
                'a_no':6,
                'a_type': 'mandatory',
                'agreement': "I agree that the consultation between me and CognoSpeak can be video-recorded."
            },
            {
                'a_no':7,
                'a_type': 'optional',
                'agreement': "I agree that the researchers can use extracts of the written, video and sound material collected in this study, without any additional information that could identify me, for future ethically approved studies."
            },
            {
                'a_no':8,
                'a_type': 'optional',
                'agreement': "I agree that the researchers can use extracts of the written, video and sound material in scientific publications about the findings of this study and to teach healthcare students and professionals, without any additional information that could identify me. This may include short quotes from the audio and/or video recorded data."
            },
            {
                'a_no':9,
                'a_type': 'optional',
                'agreement': "I understand that my capacity to consent will be assessed prior to research visits occurring at home, approximately 1 month prior to the research visits, as outlined in the Participant Information sheet. If the clinician deems that I have lost the capacity to consent during the study, I will be withdrawn from the study and my data will be kept for use in this study and relevant future research. No further data will be collected or any other research assessments will be carried out."
            },
            {
                'a_no':10,
                'a_type': 'optional',
                'agreement': "I agree for my data (without any additional information that could identify me) to be stored for 10 years, following the end of the study"
            },
            {
                'a_no':11,
                'a_type': 'optional',
                'agreement': "I would like to be informed of the results of the study."
            },
            {
                'a_no':12,
                'a_type': 'optional',
                'agreement': "I agree that I may be contacted with details of future research projects, and that there will be no obligation for me to participate."
            },
            {
                'a_no':13,
                'a_type': 'optional',
                'agreement': "I consent to my GP to be contacted to inform him/her that I am taking part in this study."
            },
            {
                'a_no':14,
                'a_type': 'optional',
                'agreement': "OPTIONAL (if participated in AAA-MC): I consent to data recorded from AAA-MC to be included in this study to allow the researchers to see how my memory has changed over time."
            },
            {
                'a_no':15,
                'a_type': 'last',
                'agreement': "I agree to take part in the study."
            }
        ]  
    },
    'consent_hc': {
        'image_url' :'Images/logo.png',
        'title' : 'Informed Consent Form',
        'participants': 'Healthy Volunteer',
        'project': 'CognoSpeak: An automated cognitive assessment tool based on language (utilising automated speech recognition and Machine Learning)',
        'reference': 'Study Reference: STH20818',
        'pi': 'Principal Investigator: Dr Daniel Blackburn',
        'mandatory_statement': 'Please tick the box for each statement to indicate that you agree:',
        'optional_statement': 'For the following statements, please respond with either YES or NO:',
        'sign_statement': 'Please type your name below to sign this consent form then click submit', 
        'agreements': [
            {
                'a_no':1,
                'a_type': 'mandatory',
                'agreement': "I confirm that I have read and understand the Information Sheet (V1, Date: ) for the above study and had an opportunity to ask questions."
            },
            {
                'a_no':2,
                'a_type': 'mandatory',
                'agreement': "I have had the opportunity to consider the information, ask questions and have had these answered satisfactorily."
            },
            {
                'a_no':3,
                'a_type': 'mandatory',
                'agreement': "I understand that my participation is voluntary and that I am free to withdraw at any time, without giving any reason, without my medical care or rights being affected."
            },
            {
                'a_no':4,
                'a_type': 'mandatory',
                'agreement': "I understand that if I am not a STH patient and do not have STH medical notes, then I give permission that a participant file will be made up me and these files and any other data collected during the study may be looked at by individuals from the Sheffield Teaching Hospitals NHS Trust, Sheffield Health and Social Care NHS Trust, The University of Sheffield and the regulatory authorities where it is relevant to my taking part in this research. I give permission for these individuals to have access to my records."
            },
            {
                'a_no':5,
                'a_type': 'mandatory',
                'agreement': "I understand that if I am an STH patient and have STH medical notes, I agree that relevant sections of my medical notes may be looked at by members of the research team or individuals from the Sheffield Teaching Hospitals NHS Trust, Sheffield Health and Social Care NHS Trust, The University of Sheffield and the regulatory authorities where it is relevant to my taking part in this research. I give permission for these individuals to have access to my records."
            },
            {
                'a_no':6,
                'a_type': 'mandatory',
                'agreement': "I agree that the consultations between me and CognoSpeak can be audio-recorded."
            },
            {
                'a_no':7,
                'a_type': 'mandatory',
                'agreement': "I agree that the consultation between me and CognoSpeak can be video-recorded."
            },
            {
                'a_no':8,
                'a_type': 'optional',
                'agreement': "I agree that the researchers can use extracts of the written, video and sound material collected in this study, without any additional information that could identify me, for future ethically approved studies."
            },
            {
                'a_no':9,
                'a_type': 'optional',
                'agreement': "I agree that the researchers can use extracts of the written, video and sound material in scientific publications about the findings of this study and to teach healthcare students and professionals, without any additional information that could identify me. This may include short quotes from the audio and/or video recorded data."
            },
            {
                'a_no':10,
                'a_type': 'optional',
                'agreement': "I agree for my data (without any additional information that could identify me) to be stored for 10 years, following the end of the study."
            },
            {
                'a_no':11,
                'a_type': 'optional',
                'agreement': "I would like to be informed of the results of the study."
            },
            {
                'a_no':12,
                'a_type': 'optional',
                'agreement': "I agree that I may be contacted with details of future research projects, and that there will be no obligation for me to participate."
            },
            {
                'a_no':13,
                'a_type': 'optional',
                'agreement': "I consent to my GP to be contacted to inform him/her that I am taking part in this study."
            },
            {
                'a_no':14,
                'a_type': 'last',
                'agreement': "I agree to take part in the study."
            }
        ] 
    },
    'consent_md': {
        'image_url' :'Images/logo.png',
        'title' : 'Informed Consent Form',
        'participants': 'Individual with suspected movement disorder',
        'project': 'CognoSpeak: An automated cognitive assessment tool based on language (utilising automated speech recognition and Machine Learning)',
        'reference': 'Study Reference: STH20818',
        'pi': 'Principal Investigator: Dr Daniel Blackburn',
        'mandatory_statement': 'Please tick the box for each statement to indicate that you agree:',
        'optional_statement': 'For the following statements, please respond with either YES or NO:',
        'sign_statement': 'Please type your name below to sign this consent form then click submit', 
        'agreements': [
            {
                'a_no':1,
                'a_type': 'mandatory',
                'agreement': "I confirm that I have read and understand the Information Sheet (V1, Date: ) for the above study and had an opportunity to ask questions."
            },
            {
                'a_no':2,
                'a_type': 'mandatory',
                'agreement': "I have had the opportunity to consider the information, ask questions and have had these answered satisfactorily."
            },
            {
                'a_no':3,
                'a_type': 'mandatory',
                'agreement': "I understand that my participation is voluntary and that I am free to withdraw at any time, without giving any reason, without my medical care or rights being affected."
            },
            {
                'a_no':4,
                'a_type': 'mandatory',
                'agreement': "I understand that relevant sections of my medical notes and the data collected during the study may be looked at by individuals from regulatory authorities, Sheffield Teaching Hospitals NHS Foundation Trust, Sheffield Health and Social Care NHS Foundation Trust, the University of Sheffield, where it is relevant to my taking part in this research. I give permission for such individuals to have access to my records."
            },
            {
                'a_no':5,
                'a_type': 'mandatory',
                'agreement': "I agree that the consultations between me and CognoSpeak can be audio-recorded."
            },
            {
                'a_no':6,
                'a_type': 'mandatory',
                'agreement': "I agree that the consultation between me and CognoSpeak can be video-recorded."
            },
            {
                'a_no':7,
                'a_type': 'optional',
                'agreement': "I agree that the researchers can use extracts of the written, video and sound material collected in this study, without any additional information that could identify me, for future ethically approved studies."
            },
            {
                'a_no':8,
                'a_type': 'optional',
                'agreement': "I agree that the researchers can use extracts of the written, video and sound material in scientific publications about the findings of this study and to teach healthcare students and professionals, without any additional information that could identify me. This may include short quotes from the audio and/or video recorded data."
            },
            {
                'a_no':9,
                'a_type': 'optional',
                'agreement': "I understand that my capacity to consent will be assessed prior to research visits occurring at home, approximately 1 month prior to the research visits, as outlined in the Participant Information sheet. If the clinician deems that I have lost the capacity to consent during the study, I will be withdrawn from the study and my data will be kept for use in this study and relevant future research. No further data will be collected or any other research assessments will be carried out."
            },
            {
                'a_no':10,
                'a_type': 'optional',
                'agreement': "I agree for my data (without any additional information that could identify me) to be stored for 10 years, following the end of the study."
            },
            {
                'a_no':11,
                'a_type': 'optional',
                'agreement': "I would like to be informed of the results of the study."
            },
            {
                'a_no':12,
                'a_type': 'optional',
                'agreement': "I agree that I may be contacted with details of future research projects, and that there will be no obligation for me to participate."
            },
            {
                'a_no':13,
                'a_type': 'optional',
                'agreement': "I consent to my GP to be contacted to inform him/her that I am taking part in this study."
            },
            {
                'a_no':14,
                'a_type': 'last',
                'agreement': "I agree to take part in the study."
            }
        ]  
    },
    'consent_stroke': {
        'image_url' :'Images/logo.png',
        'title' : 'Informed Consent Form',
        'participants': 'Individual who have suffered a Stroke',
        'project': 'CognoSpeak: An automated cognitive assessment tool based on language (utilising automated speech recognition and Machine Learning)',
        'reference': 'Study Reference: STH20818',
        'pi': 'Principal Investigator: Dr Daniel Blackburn',
        'mandatory_statement': 'Please tick the box for each statement to indicate that you agree:',
        'optional_statement': 'For the following statements, please respond with either YES or NO:',
        'sign_statement': 'Please type your name below to sign this consent form then click submit', 
        'agreements': [
            {
                'a_no':1,
                'a_type': 'mandatory',
                'agreement': "I confirm that I have read and understand the Information Sheet (V1, Date: ) for the above study and had an opportunity to ask questions."
            },
            {
                'a_no':2,
                'a_type': 'mandatory',
                'agreement': "I have had the opportunity to consider the information, ask questions and have had these answered satisfactorily."
            },
            {
                'a_no':3,
                'a_type': 'mandatory',
                'agreement': "I understand that my participation is voluntary and that I am free to withdraw at any time, without giving any reason, without my medical care or rights being affected."
            },
            {
                'a_no':4,
                'a_type': 'mandatory',
                'agreement': "I understand that relevant sections of my medical notes and the data collected during the study may be looked at by individuals from regulatory authorities, Sheffield Teaching Hospitals NHS Foundation Trust, Sheffield Health and Social Care NHS Foundation Trust, the University of Sheffield, where it is relevant to my taking part in this research. I give permission for such individuals to have access to my records."
            },
            {
                'a_no':5,
                'a_type': 'mandatory',
                'agreement': "I agree that the consultations between me and CognoSpeak can be audio-recorded."
            },
            {
                'a_no':6,
                'a_type': 'mandatory',
                'agreement': "I agree that the consultation between me and CognoSpeak can be video-recorded."
            },
            {
                'a_no':7,
                'a_type': 'optional',
                'agreement': "I agree that the researchers can use extracts of the written, video and sound material collected in this study, without any additional information that could identify me, for future ethically approved studies."
            },
            {
                'a_no':8,
                'a_type': 'optional',
                'agreement': "I agree that the researchers can use extracts of the written, video and sound material in scientific publications about the findings of this study and to teach healthcare students and professionals, without any additional information that could identify me. This may include short quotes from the audio and/or video recorded data."
            },
            {
                'a_no':9,
                'a_type': 'optional',
                'agreement': "I understand that my capacity to consent will be assessed prior to research visits occurring at home, approximately 1 month prior to the research visits, as outlined in the Participant Information sheet. If the clinician deems that I have lost the capacity to consent during the study, I will be withdrawn from the study and my data will be kept for use in this study and relevant future research. No further data will be collected or any other research assessments will be carried out."
            },
            {
                'a_no':10,
                'a_type': 'optional',
                'agreement': "I agree for my data (without any additional information that could identify me) to be stored for 10 years, following the end of the study."
            },
            {
                'a_no':11,
                'a_type': 'optional',
                'agreement': "I would like to be informed of the results of the study."
            },
            {
                'a_no':12,
                'a_type': 'optional',
                'agreement': "I agree that I may be contacted with details of future research projects, and that there will be no obligation for me to participate."
            },
            {
                'a_no':13,
                'a_type': 'optional',
                'agreement': "I consent to my GP to be contacted to inform him/her that I am taking part in this study."
            },
            {
                'a_no':14,
                'a_type': 'last',
                'agreement': "I agree to take part in the study."
            }
        ] 
    },
    'questions_ivastroke1':[
        {
            'q_no':0,
            'text':'Hello, I am a computerised doctor and I’ll be asking you questions today. I will ask you the sorts of questions doctors ask in a memory clinic. Thank you for talking to me. I will start to ask questions shortly.',
            'length':15000,
            'video_url':'mp4/q_0.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false 
        },
        {
            'q_no':1,
            'text':'Please read the following paragraph',
            'length':4000,
            'video_url':'mp4/paragraph.mp4',
            'image_url':'',
            'show_text':true, 
            'play_buzzer':false 
        },
        {
            'q_no':2,
            'text':'Tell me what problems you have noticed with your memory recently.',
            'length':5000,
            'video_url':'mp4/recent_memory_issue.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false
        },
        {
            'q_no':3,
            'text':'Who is most worried about your memory you or somebody else?',
            'length':5000,
            'video_url':'mp4/who_most_worried.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false
        },
        {
            'q_no':4,
            'text':'What did you do over last weekend, giving as much detail as you can?',
            'length':0,
            'video_url':'mp4/what_you_did_last_weekend.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false
        },
        {
            'q_no':5,
            'text':'What has been in the news recently?',
            'length':4000,
            'video_url':'mp4/recent_news.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false
        },
        {
            'q_no':6,
            'text':'Tell me what you did when you left school. What jobs did you do?',
            'length':5000,
            'video_url':'mp4/left_school_jobs.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false 
        },
        {
            'q_no':7,
            'text':'Tell me about your last job or your current job.',
            'length':5000,
            'video_url':'mp4/last_current_job.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false 
        },
        {
            'q_no':8,
            'text':'Who manages your finances? You or somebody else? ',
            'length':5000,
            'video_url':'mp4/who_manages_finances.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false 
        },
        {
            'q_no':9,
            'text':'Please name as many animals as you can. You can name any type of animal you will have one minute. Please start after you hear the buzzer.',
            'length':16000,
            'video_url':'mp4/ft_animals.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':true 
        },
        {
            'q_no':10,
            'text':'Please name as many words as you can that begin with the letter p. It can be any word beginning with p except for names of people such as Peter or names of countries such as Portugal. Please start answering after you hear the buzzer.',
            'length':16000,
            'video_url':'mp4/ft_p_words.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':true
        },
        {
            'q_no':11,
            'text':'Tell me everything you see going on in this picture. Please describe it in as much detail as you can. When you have finished press forward.',
            'length':10000,
            'video_url':'mp4/cookie_theft_description.mp4',
            'image_url':'Images/cookietheft.gif',
            'show_text':false, 
            'play_buzzer':false 
        }, 
        {
            'q_no':12,
            'text':'Please say the months of the year in reverse order.',
            'length':5000,
            'video_url':'mp4/months_in_reverse.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false
        },
        {
            'q_no':13,
            'text':'Could you tell how to make a cup of tea? Please describe it step by step.',
            'length':6000,
            'video_url':'mp4/how_to_make_tea.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false
        }, 
        {
            'q_no':14,
            'text':'THANK YOU FOR TAKING PART THE TRIAL IS NOW OVER',
            'length':4000,
            'video_url':'mp4/q_13.mp4',
            'image_url':'',
            'show_text':false, 
            'play_buzzer':false 
        }
	],
    'questions_iva3':[
        	{
                'q_no':0,
                'text':'HELLO, I AM A COMPUTERISED DOCTOR AND I’LL BE ASKING YOU QUESTIONS TODAY. I WILL ASK YOU THE SORTS OF QUESTIONS DOCTORS ASK IN A MEMORY CLINIC. THANK YOU FOR TALKING TO ME. I WILL START TO ASK QUESTIONS SHORTLY.',
                'length':15000,
                'video_url':'mp4/q_0.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false 
            },
            {
                'q_no':1,
                'text':'WHERE HAVE YOU COME IN FROM TODAY AND WHAT ARE YOU HOPING TO FIND OUT',
                'length':6000,
                'video_url':'mp4/q_1.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false 
            },
            {
                'q_no':2,
                'text':'TELL ME WHAT PROBLEMS YOU HAVE NOTICED WITH YOUR MEMORY RECENTLY',
                'length':5000,
                'video_url':'mp4/q_2.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false
            },
            {
                'q_no':3,
                'text':'WHO IS MOST WORRIED ABOUT YOUR MEMORY YOU OR SOMEBODY ELSE',
                'length':5000,
                'video_url':'mp4/q_3.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false
            },
            {
                'q_no':4,
                'text':'WHAT DID YOU DO OVER LAST WEEKEND GIVING AS MUCH DETAIL AS YOU CAN',
                'length':0,
                'video_url':'mp4/q_4.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false
            },
            {
                'q_no':5,
                'text':'WHAT HAS BEEN IN THE NEWS RECENTLY',
                'length':4000,
                'video_url':'mp4/q_5.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false
            },
            {
                'q_no':6,
                'text':'TELL ME ABOUT THE SCHOOL YOU WENT TO AND HOW OLD YOU WERE WHEN YOU LEFT',
                'length':5000,
                'video_url':'mp4/q_6.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false 
            },
            {
                'q_no':7,
                'text':'TELL ME WHAT YOU DID WHEN YOU LEFT SCHOOL WHAT JOBS DID YOU DO',
                'length':5000,
                'video_url':'mp4/q_7.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false 
            },
            {
                'q_no':8,
                'text':'TELL ME ABOUT YOUR LAST JOB GIVE AS MUCH DETAIL AS YOU CAN',
                'length':5000,
                'video_url':'mp4/q_8.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false 
            },
            {
                'q_no':9,
                'text':'WHO MANAGES YOUR FINANCES YOU OR SOMEBODY ELSE',
                'length':5000,
                'video_url':'mp4/q_9.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false
            },
            {
                'q_no':10,
                'text':'PLEASE NAME AS MANY ANIMALS AS YOU CAN YOU CAN NAME ANY TYPE OF ANIMAL YOU WILL HAVE ONE MINUTE PLEASE START AFTER YOU HEAR THE BUZZER',
                'length':16000,
                'video_url':'mp4/q_10.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':true 
            },
            {
                'q_no':11,
                'text':'PLEASE NAME AS MANY WORDS AS YOU CAN THAT BEGIN WITH THE LETTER P IT CAN BE ANY WORD BEGINNING WITH P EXCEPT FOR NAMES OF PEOPLE SUCH AS PETER OR NAMES OF COUNTRIES SUCH AS PORTUGAL PLEASE START ANSWERING AFTER YOU HEAR THE BUZZER',
                'length':16000,
                'video_url':'mp4/q_11.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':true
            },
            {
                'q_no':12,
                'text':'TELL ME EVERYTHING YOU SEE GOING ON IN THIS PICTURE PLEASE DESCRIBE IT IN AS MUCH DETAIL AS YOU CAN WHEN YOU HAVE FINISHED PRESS FORWARD',
                'length':10000,
                'video_url':'mp4/q_12.mp4',
                'image_url':'Images/cookietheft.gif',
                'show_text':false, 
                'play_buzzer':false 
            },
            {
                'q_no':13,
                'text':'THANK YOU FOR TAKING PART THE TRIAL IS NOW OVER',
                'length':4000,
                'video_url':'mp4/q_13.mp4',
                'image_url':'',
                'show_text':false, 
                'play_buzzer':false 
            }
	],
    'survey_iqcode':{
        'title':'Informant Questionnaire on Cognitive Decline in the Elderly (IQCODE)',
        'main_q':'Compared with 10 years ago how is this person at:',
        'questions': [
            {
                'q_no':1,
                'text':'Remembering things about family and friends - eg, occupations, birthdays, addresses?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':2,
                'text':'Remembering things that have happened recently?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':3,
                'text':'Recalling conversations a few days later?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':4,
                'text':'Remembering his/her address and telephone number?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':5,
                'text':'Remembering what day and month it is?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':6,
                'text':'Remembering where things are usually kept?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':7,
                'text':'Remembering where to find things which have been put in a different place from usual?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':8,
                'text':'Knowing how to work familiar machines around the house?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':9,
                'text':'Learning to use a new gadget or machine around the house?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':10,
                'text':'Learning new things in general?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':11,
                'text':'Following a story in a book or on TV?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':12,
                'text':'Making decisions on everyday matters?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':13,
                'text':'Handling money for shopping?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':14,
                'text':'Handling financial matters - eg, the pension, dealing with the bank?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':15,
                'text':'Handling other everyday arithmetic problems - eg, knowing how much food to buy, knowing how long between visits from family or friends?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
            {
                'q_no':16,
                'text':'Using his/her intelligence to understand what\'s going on and to reason things through?',
                'answers':{
                    'type':'options',
                    'values':['Much improved','A bit improved','Not much improved','A bit worse','Much worse']
                }
            },
        ]
    },
    'survey_anosognosia_pat':{
        'title':'Measurement of anosognosia A (patient)',
        'main_q':'Compared with 10 years ago how is this person at:',
        'questions': [
            {
                'q_no':1,
                'text':'Do you think you have a memory problem?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':2,
                'text':'Is your memory worse than it was 6 months ago?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':3,
                'text':'Do you have difficulty in following conversations?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':4,
                'text':'Do you find it easy to remember events that happened in the news in the last 5 years?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':5,
                'text':'Do you often find yourself putting things down (e.g. keys) and then forgetting where you have put them?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':6,
                'text':'If I asked you about details of this questionnaire in 1 month\'s time, do you think you will be able to remember it well?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':7,
                'text':'Do you find it easy to follow what people are saying to you?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':8,
                'text':'Do you often find yourself in the situation where something is \`on the tip of your tongue\` but you cannot remember it?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':9,
                'text':'Do you forget to take your medication?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':10,
                'text':'Do you initiate your own showering/bathing routine?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':11,
                'text':'Do you find it increasingly difficult to recall memories from your adult life (i.e. a number of years ago)?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':12,
                'text':'Have you been experiencing difficulties trying to concentrate on activities such as watching a TV programme or reading a book?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':13,
                'text':'Do you often forget to turn the lights off when you go out or go to bed?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':14,
                'text':'Female: In the last year have you been less active in housewoek/cooking/hobbies than you have previously been?|Male: In the last year have you been less active doing gardening/DIY/hobbies than you have previously been?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':15,
                'text':'Has your ability to pay attention to what goes on around you changed in recent years?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            }
        ] 
    },
    'survey_anosognosia_carer':{
        'title':'Measurement of anosognosia B (carer)',
        'main_q':'Compared with 10 years ago how is this person at:',
        'questions': [
            {
                'q_no':1,
                'text':'Does your partner have a memory problem?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':2,
                'text':'Is your partner\'s memory worse than it was 6 months ago?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':3,
                'text':'Does your partner have difficulty in following conversations?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':4,
                'text':'Do they find it easy to remember events that happened in the news in the last 5 years?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':5,
                'text':'Do they often put things down (e.g. keys) and then forget where they have put them?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':6,
                'text':'If I asked your partner about details of this questionnaire in 1 month\'s time, do you think they would be able to remember it well?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':7,
                'text':'Do they find it easy to follow what people are saying to them?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':8,
                'text':'Do they often complain that something is on the tip of their tongue but they cannot remember it?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':9,
                'text':'Do they forget to take their medication?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':10,
                'text':'Do they initiate their own showering/bathing routine?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':11,
                'text':'Does your partner find it increasingly difficult to recall memories from their adult life (i.e. a number of years ago)?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':12,
                'text':'Do they appear to have difficulties trying to concentrate on activities such as watching a TV programme or reading a book?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':13,
                'text':'Does your partner often forget to turn the lights off when they go out or go to bed?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':14,
                'text':'Female: In the last year have they been less active in housewoek/cooking/hobbies than they have previously been?|Male: In the last year have they been less active doing gardening/DIY/hobbies than they have previously been?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            },
            { 
                'q_no':15,
                'text':'Has your partner\'s ability to pay attention to what goes on around them changed in recent years?',
                'answers':{
                    'type':'yesno',
                    'values':['Yes','No']
                }
            }
        ] 
    }
}