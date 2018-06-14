/* SessionEnded.js */

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

module.exports.default = SessionEndedRequestHandler;
