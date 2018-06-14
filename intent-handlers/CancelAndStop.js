/* CancelAndStop.js */

const messages = require('../data/messages.json');

const CancelAndStopIntentHandler = {
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

module.exports.default = CancelAndStopIntentHandler;

