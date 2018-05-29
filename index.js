/* index.js */

const Alexa = require('ask-sdk');
const axios = require('axios');

const messages = {
    WELCOME: 'Welcome to Native Land!  You can find out which nation\'s land you are on by asking me whose land am I on.',
    WHAT_DO_YOU_WANT: 'Ask me where you are by saying: where am I?',
    NOTIFY_MISSING_PERMISSIONS: 'Please enable Location permissions in the Amazon Alexa app.',
    NO_ADDRESS: 'It looks like you don\'t have an address set. You can set your address from the companion app.',
    ERROR: 'Uh Oh. Looks like something went wrong.',
    NL_LOCATION_FAILURE: 'There was an error with the Native Land Api. Please try again',
    GOODBYE: 'Bye! Thanks for using the Sample Device Address API Skill!',
    UNHANDLED: 'This skill doesn\'t support that. Please ask something else.',
    HELP: 'You can use this skill by asking something like: whose land am I on?',
    STOP: 'Bye! Thanks for using the Sample Device Address API Skill!',
};

const IPA = {
    musqueam: 'xʷməθkʷəjˀəm',
    tsleil_waututh: 'səl’ilwətaɁɬ',
    squamish: '/ˈskwɔːmɪʃ/'
};

const PERMISSIONS = ['read::alexa:device:all:address:country_and_postal_code'];

const buildSSML = nlData => {
    let SSML;

    if (nlData.length === 1) {
        const ph = IPA[nlData.nation.properties.Name];
        let englishName;

        for (let name of IPA) {
            if (IPA[name] === ph) {
                englishName = name;
            }
        }

        SSMl =  `
            <speak>
                You are on the land of the <phoneme alphabet="ipa" ph="${ph}">${englishName}</phoneme>
            </speak>
        `;

    } else if (nlData.length > 1) {
        const IPAnames = nlData.map(nation => {
            if (IPA[nation.properties.Name]) {
                return IPA[nation.properties.Name];
            }
        });

        const lastIPA = IPAnames.pop();
        let lastEnglishName;

        for (let name of IPA) {
            if (IPA[name] === lastIPA) {
                lastEnglishName = name;
            }
        }

        const phonemeStr = IPAnames.map(ph => {
            let englishName;

            for (let name of IPA) {
                if (IPA[name] === ph) {
                    englishName = name;
                }
            }

            if (englishName) {
                return `
                    <phoneme alphabet="ipa" ph="${ph}">${englishName}</phoneme>
                `
            }
        });

        const nameString = phonemeStr.join(', ');

        SSML = `
            <speak>
                You are on the lands of the ${nameString}, and the <phoneme alphabet="ipa" ph="${lastIPA}">${lastEnglishName}</phoneme>.
            </speak>
        `;
    } else if (nlData.length === 0) {
        SSML = NL_LOCATION_FAILURE;
    }

    return SSML;
}

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

        const consentToken = requestEnvelope.context.System.user.permissions &&
            requestEnvelope.context.System.user.permissions.consentToken;
        if (!consentToken) {
            return responseBuilder
                .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                .withAskForPermissionsConsentCard(PERMISSIONS)
                .getResponse();
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

                const message = buildSSML(nativeLand.data);

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
