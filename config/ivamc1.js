// config/ivamc1.js
shared_conf    = require( './shared_conf.js' );

module.exports = { 
    'consent': shared_conf.consent_mc,
    'questions': shared_conf.questions_iva3, 
    'surveys': [shared_conf.survey_anosognosia_pat, shared_conf.survey_anosognosia_carer]
};