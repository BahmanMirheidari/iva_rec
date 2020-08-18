// config/ivastroke2.js
shared_conf    = require( './shared_conf.js' );

module.exports = { 
    'consent': {},
    'pre_surveys': [],
    'questions': shared_conf.questions_ivastroke_fl_ct_gp_cp2, 
    'surveys': [shared_conf.survey_phq8, shared_conf.survey_gad7]
};