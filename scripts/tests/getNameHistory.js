/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = async function () {
    const MojangJS = require('mojang.js');
    const mojang = new MojangJS.Mojang.Client();

    const player = '398c75693f154998b0d9be91a9ac935c';
    console.log(`Getting name history for single player: ${player}`);
    const spResponse = await mojang.getNameHistory(player);
    console.log('Received', spResponse);
};