/* buildSSML.js */

const IPA = require('../data/IPA.json');
const messages = require('../data/messages.json');

const buildSSML = nlData => {
    let SSML;

    try {
        if (nlData.length === 1) {
            let ph;
            let name;

            for (let data of IPA) {
                if (data.slug === nlData[0].properties.Slug && data.IPA) {
                    ph = data.IPA;
                    name = data.name;
                } else {
                    // No IPA data found build standard response
                    return null;
                }
            }

            SSMl = `
                <speak>
                    You are on the land of the <phoneme alphabet="ipa" ph="${ph}">${name}</phoneme>
                </speak>
            `;
            console.log('SSML 1: ', SSML)
        } else if (nlData.length > 1) {
            const matches = nlData.map(nation => {
                for (let data of IPA) {

                    if (data.slug === nation.properties.Slug) {
                        return data;
                    }
                }
            });

            const lastMatch = matches.pop();

            const phonemeStr = matches.map(data => {
                return `
                    <phoneme alphabet="ipa" ph="${data.IPA}">${data.name}</phoneme>
                `
            });

            const nameString = phonemeStr.join(', ');

            SSML = `
                <speak>
                    You are on the lands of the ${nameString}, and the <phoneme alphabet="ipa" ph="${lastMatch.IPA}">${lastMatch.name}</phoneme>.
                </speak>
            `;
            console.log('SSML 2: ', SSML)
        } else if (nlData.length === 0) {
            SSML = messages.NL_LOCATION_FAILURE;
            console.log('SSML 3: ', SSML)
        }

        console.log('SSML: ', SSML);
        return SSML;
    } catch (err) {
        console.log(err.message)
    }
}

module.exports.default = buildSSML;
