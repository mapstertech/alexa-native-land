/* Launch.js */

const messages = require('../data/messages.json');

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

module.exports.default = LaunchRequestHandler;
