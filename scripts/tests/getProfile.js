/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = async function () {
    const MojangJS = require('@tecc/mojang.js');
    const mojang = new MojangJS.MojangClient();

    const player = '398c75693f154998b0d9be91a9ac935c';
    console.log(`Getting profile for single player: ${player}`);
    const spResponse = await mojang.getProfile(player);
    console.log('Received', spResponse);
    console.dir(spResponse.getSkin());
    console.dir(spResponse.getCape());
};