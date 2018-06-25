/* Fallback.js */

const messages = require('../data/messages.json');

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        console.log('handlerinput', handlerInput)
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speechText = messages.FALLBACK;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Native Land', speechText)
            .getResponse();
    }
};

module.exports.default = FallbackIntentHandler;
