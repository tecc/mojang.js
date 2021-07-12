/* eslint-disable @typescript-eslint/no-var-requires */
const TOKEN_COUNT = 500;
module.exports = async function () {
    const MojangJS = require('@tecc/mojang.js');
    const tokens = [];
    for (let i = 0; i < TOKEN_COUNT; i++) {
        const generated = MojangJS.Yggdrasil.generateClientToken();
        if (tokens.includes(generated)) throw new Error(`Token generated twice (${generated})!`);
        tokens.push(generated);
    }
    console.log(`Generated ${TOKEN_COUNT} tokens`);
};