/* All request handlers exports */

const CancelAndStop  = require('./CancelAndStop').default;
const Help           = require('./Help').default;
const Launch         = require('./Launch').default;
const SessionEnded   = require('./SessionEnded').default;
const SSML           = require('./SSML').default;
const WhoseLandAmIOn = require('./WhoseLand').default;

module.exports = {
    CancelAndStop,
    Help,
    Launch,
    SessionEnded,
    SSML,
    WhoseLandAmIOn
}
