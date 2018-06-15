/* buildStandardResponse.js */

const messages = require('../data/messages.json');

const buildStandardResponse = nlData => {
    try {
        let message;
        if (nlData.length === 1) {
            message = `You are on the land of the ${nlData[0].properties.Name}.`;
        } else if (nlData.length > 1) {
            const names = nlData.map(nationData => {
                return nationData.properties.Name;
            });
            const last = names.pop();
            const nameString = names.join(', ')

            message = `You are on the lands of the ${nameString}, and the ${last}.`;
        } else if (nlData.length === 0) {
            message = messages.NL_LOCATION_FAILURE;
        }
        return message;
    } catch (err) {
        console.log(err.message)
    }
}

module.exports.default = buildStandardResponse;
