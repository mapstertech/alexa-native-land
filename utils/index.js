/* All utils exports */

const buildSSML = require('./buildSSML').default;
const sendProgressiveResponse = require('./sendProgressiveResponse').default;
const buildStandardResponse = require('./buildStandardResponse').default;

module.exports = {
    buildSSML,
    sendProgressiveResponse,
    buildStandardResponse
}
