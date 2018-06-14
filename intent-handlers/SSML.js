/* SSML.js */
// This intent is for testing mainly

const IPA = require('../data/IPA.json');

const SSMLIntentHandler = {
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

module.exports.default = SSMLIntentHandler;

