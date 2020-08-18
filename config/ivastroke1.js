// config/ivastroke1.js
// code:ivamem1       name:CS_Memory_Q1-9_Fluency
shared_conf    = require( './shared_conf.js' );

module.exports = { 
    'consent': {},
    'pre_surveys': [],
    'questions': shared_conf.questions_ivastroke_fl_ct_gp_cp1, 
    'surveys': [shared_conf.survey_phq8, shared_conf.survey_gad7]
};