// config/ivaem5.js
// code:ivamem5       name:CS_Memory_Q1-9_Fluency_CookieTheft_ComplexPic2_GrandfatherPassage_PHQ8-GAD7
shared_conf    = require( './shared_conf.js' );

module.exports = { 
    'consent': {},
    'pre_surveys':[],
    'questions':shared_conf.questions_ivamem_fl_ct_gp_cp2, 
    'surveys': [shared_conf.survey_phq8, shared_conf.survey_gad7]  
};