/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = async function () {
    const MojangJS = require('@tecc/mojang.js');

    function isUndefined(name, val) {
        if (!val) throw new Error(`${name} is undefined`);
    }

    function noneIsUndefined(name, value, depth) {
        isUndefined(name, value);
        console.debug(`${name} is not undefined`);
        if (depth - 1 <= 0) return;
        const keys = Object.keys(value);
        if (keys) {
            for (let key of keys) {
                const prop = value[key];
                if (typeof(prop) == 'object') {
                    noneIsUndefined(`${name}.${key}`, prop, depth - 1);
                }
            }
        }
    }

    noneIsUndefined('MojangJS', MojangJS);

    // TODO: prototype checking using typescript, kinda bad using this system
};