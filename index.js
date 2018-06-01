/* index.js */

const Alexa = require('ask-sdk');
const axios = require('axios');

const messages = require('./data/messages.json');
const IPA = require('./data/IPA.json');
const utils = require('./utils');

const PERMISSIONS = ['read::alexa:device:all:address:country_and_postal_code'];

axios.interceptors.request.use(config => {
    // Do something before request is sent

    console.log('REQUEST SENT -- METHOD: ' + config.method, config)
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

/* Handlers */

const SSSMLIntentHandler = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'SSMLIntent';
    },
    handle(handlerInput) {
        const SPEECH =
            `<speak>
                You are on the land of the <phoneme alphabet="ipa" ph="${IPA.squamish}">Squamish</phoneme>
            </speak>`;

        // `<speak>
        //     Lets learn some Ditidaht! <phoneme alphabet="ipa" ph="čačabax̣">čačabax̣</phoneme>,
        //                               <phoneme alphabet="ipa" ph="ʔuuquubs">ʔuuquubs</phoneme>,
        //                               <phoneme alphabet="ipa" ph="šu">šu</phoneme>
        // </speak>`;

        return handlerInput.responseBuilder
            .speak(SPEECH)
            .getResponse();
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.WELCOME)
            .reprompt(messages.WHAT_DO_YOU_WANT)
            .withSimpleCard('Native Land', messages.WELCOME)
            .getResponse();
    }
};

const WhoseLandAmIOnIntentHandler = {
    canHandle(handlerInput) {
        console.log('handlerInput', handlerInput)
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'WhoseLandIntent';
    },
    async handle(handlerInput) {
        const {
            requestEnvelope,
            serviceClientFactory,
            responseBuilder
        } = handlerInput;

        const consentToken = requestEnvelope.context.System.user.permissions && requestEnvelope.context.System.user.permissions.consentToken;
        if (!consentToken) {
            return responseBuilder
                .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                .withAskForPermissionsConsentCard(PERMISSIONS)
                .getResponse();
        }

        try {
            utils.sendProgressiveResponse(requestEnvelope);
        } catch (err) {
            console.log(err.message)
        }

        try {
            const deviceId = requestEnvelope.context.System.device.deviceId;
            const accessToken = requestEnvelope.context.System.apiAccessToken;

            const url = `https://api.amazonalexa.com/v1/devices/${deviceId}/settings/address/countryAndPostalCode`;

            const location = await axios.get(url, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });

            let response;

            if (location.data.countryCode === null && location.data.postalCode === null) {
                response = responseBuilder
                    .speak(messages.NO_ADDRESS)
                    .withSimpleCard('Native Land', messages.NO_ADDRESS)
                    .getResponse();
            } else {
                const mapsURL = `https://maps.googleapis.com/maps/api/geocode/json?components=country:${location.data.countryCode}|postal_code:${location.data.postalCode}&key=${process.env.MAPS_API_KEY}`;
                const mapsResponse = await axios.get(mapsURL);

                console.log('MAPS RESPONSE', mapsResponse)

                const {
                    lat,
                    lng
                } = mapsResponse.data.results[0].geometry.location;

                console.log('LAT/LNG', lat, lng)

                const nativeLandURL = `https://native-land.ca/api/index.php?maps=territories&position=${lat},${lng}`;
                const nativeLand = await axios.get(nativeLandURL);

                console.log('NL RESPONSE', nativeLand.data);

                const message = utils.buildSSML(nativeLand.data);

                response = responseBuilder
                    .speak(message)
                    .withSimpleCard('Native Land', message)
                    .getResponse();
            }
            return response;
        } catch (error) {
            console.log(error);

            if (error.name !== 'ServiceError') {
                const response = responseBuilder.speak(messages.ERROR).getResponse();
                return response;
            }
            throw error;
        }
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = messages.HELP;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Native Land', speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHAndler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = messages.GOODBYE;

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Native Land', speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // any cleanup logic goes here
        const err = handlerInput.requestEnvelope.request.error

        if (err) {
            console.log('ERROR', err);
        }

        return handlerInput.responseBuilder.getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        WhoseLandAmIOnIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHAndler,
        SessionEndedRequestHandler,
        SSSMLIntentHandler
    ).lambda();
