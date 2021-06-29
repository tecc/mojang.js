/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = async function () {
    const MojangJS = require('mojang.js');

    function isUndefined(name, val) {
        if (!val) throw new Error(`${name} is undefined`);
    }

    function noneIsUndefined(name, value, depth) {
        isUndefined(name, value);
        console.debug(`${name} is not undefined`);
        for (let key of Object.keys(value)) {
            if (depth - 1 !== 0) {
                noneIsUndefined(`${name}.${key}`, value[key], depth - 1);
            }
        }
    }

    noneIsUndefined('MojangJS', MojangJS);

    // TODO: prototype checking
};