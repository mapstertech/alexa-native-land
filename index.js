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

const DEV_LOGS = {
    canHandle(handlerInput) {
        if (DEV) {
            try {

                const { requestEnvelope } = handlerInput;
                const { request } = requestEnvelope;
                const consentToken = requestEnvelope.context.System.user.permissions && requestEnvelope.context.System.user.permissions.consentToken;
                const deviceId = requestEnvelope.context.System.device.deviceId;
                const accessToken = requestEnvelope.context.System.apiAccessToken;

                console.log({
                    r_type: request.type,
                    r_name: request.intent.name,
                    consentToken,
                    deviceId,
                    accessToken
                });
            } catch (err) {
                console.log({ error: err.message })
            }
        }
    }
}

/* Handlers */
const {
    CancelAndStop,
    Fallback,
    Help,
    Launch,
    SessionEnded,
    WhoseLandAmIOn
} = IntentHandlers

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        CancelAndStop,
        DEV_LOGS,
        Fallback,
        Help,
        Launch,
        SessionEnded,
        WhoseLandAmIOn
    ).lambda();
