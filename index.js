/* index.js */

const Alexa = require('ask-sdk');
const axios = require('axios');

const IntentHandlers = require('./intent-handlers');

const DEV = true;

if (DEV) {
    axios.interceptors.request.use(config => {
        console.log(`REQUEST SENT -- METHOD: ${config.method}`, config);

        return config;
    }, error => {
        console.log(errror)
        // Do something with request error
        return Promise.reject(error);
    });
}

/* Handlers */
const {
    CancelAndStop,
    Help,
    Launch,
    SessionEnded,
    SSML,
    WhoseLandAmIOn
} = IntentHandlers

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        CancelAndStop,
        Help,
        Launch,
        SessionEnded,
        SSML,
        WhoseLandAmIOn
    ).lambda();
