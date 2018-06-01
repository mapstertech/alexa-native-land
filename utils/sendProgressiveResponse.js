/* sendProgressiveResponse.js */

const axios = require('axios');

const sendProgressiveResponse = requestEnvelope => {
    // console.log('sending a progressive response')
    try {
        const url = 'https://api.amazonalexa.com/v1/directives';
        const accessToken = requestEnvelope.context.System.apiAccessToken;
        const requestId = requestEnvelope.request.requestId;

        console.log(
            'PROGRESSIVE SPEECH DIRECTIVE',
            'requestId',
            requestId,
            'accesToken',
            accessToken,
        );

        const data = {
            "header": {
                "requestId": requestId
            },
            "directive": {
                "type": "VoicePlayer.Speak",
                "speech": "Let me look that up for you..."
            }
        }

        const config = {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        }

        axios.post(url, data, config)
    } catch (err) {
        console.log(err.message)
    }
}

module.exports.default = sendProgressiveResponse;
