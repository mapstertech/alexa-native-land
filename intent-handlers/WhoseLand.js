/* WhoseLand.js */
// "Alexa, ask Native Land where I am."

const axios = require('axios');
const messages = require('../data/messages.json');
const cards = require('../data/cards.json');
const utils = require('../utils');

const PERMISSIONS = ['read::alexa:device:all:address:country_and_postal_code'];


const WhoseLandAmIOnIntentHandler = {
    canHandle(handlerInput) {
        console.log('handlerInput', handlerInput)
        const { request } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'WhoseLandIntent';
    },
    async handle(handlerInput) {
        const {
            requestEnvelope,
            responseBuilder
        } = handlerInput;

        const consentToken = requestEnvelope.context.System.user.permissions && requestEnvelope.context.System.user.permissions.consentToken;
        console.log({
            consentToken: consentToken
        })

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

            console.log({
                deviceId: requestEnvelope.context.System.device.deviceId,
                accessToken: requestEnvelope.context.System.apiAccessToken,
                url: `https://api.amazonalexa.com/v1/devices/${deviceId}/settings/address/countryAndPostalCode`
            })

            const location = await axios.get(url, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });

            console.log('LOCATION', location)
            console.log('LOCATION.DATA', location.data)

            let response;

            if (!location.data.countryCode && !location.data.postalCode) {
                response = responseBuilder
                    .speak(messages.NO_ADDRESS)
                    .withSimpleCard('Native Land', cards.NO_ADDRESS)
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

                let message = utils.buildSSML(nativeLand.data);

                if (!message) {
                    message = utils.buildStandardResponse(nativeLand.data);
                }

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

module.exports.default = WhoseLandAmIOnIntentHandler;
