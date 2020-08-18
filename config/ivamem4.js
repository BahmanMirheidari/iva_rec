// config/ivaem4.js
// code:ivamem4      name:CS_Memory_Q1-9_Fluency_CookieTheft_ComplexPic1_GrandfatherPassage_PHQ8-GAD7
shared_conf    = require( './shared_conf.js' );

module.exports = { 
    'consent': {},
    'pre_surveys':[],
    'questions':shared_conf.questions_ivamem_fl_ct_gp_cp1, 
    'surveys': [shared_conf.survey_phq8, shared_conf.survey_gad7]  
};