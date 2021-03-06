// config/ivastroke_test.js
// code:ivamem1       name:CS_Memory_Q1-9_Fluency
shared_conf    = require( './shared_conf.js' );

module.exports = { 
    'consent': shared_conf.consent_hc,
    'pre_surveys': [shared_conf.survey_anosognosia_pat, shared_conf.survey_anosognosia_informant],
    'questions': shared_conf.questions_ivastroke_fl_ct_gp_cp2, 
    'surveys': [shared_conf.survey_phq8, shared_conf.survey_gad7]
};