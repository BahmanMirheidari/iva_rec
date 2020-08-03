// config/ivamc1.js
shared_conf    = require( './shared_conf.js' );

module.exports = { 
    'consent': {},
    'pre_surveys': [],
    'questions': shared_conf.questions_iva3, 
    'surveys': [shared_conf.survey_phq8, shared_conf.survey_gad7]
};