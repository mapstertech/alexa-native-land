/* All request handlers exports */

const CancelAndStop  = require('./CancelAndStop').default;
const Fallback       = require('./Fallback').default;
const Help           = require('./Help').default;
const Launch         = require('./Launch').default;
const SessionEnded   = require('./SessionEnded').default;
const WhoseLandAmIOn = require('./WhoseLand').default;

module.exports = {
    CancelAndStop,
    Fallback,
    Help,
    Launch,
    SessionEnded,
    WhoseLandAmIOn
}
