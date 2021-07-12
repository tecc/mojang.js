/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = async function () {
    const MojangJS = require('@tecc/mojang.js');
    const mojang = new MojangJS.MojangClient();

    console.log('Getting blocked servers');
    const blocked = await mojang.getBlockedServers();
    console.log('Blocked server count: ' + blocked.length);
    console.log('First 3: ' + blocked[0] + ', ' + blocked[1] + ', ' + blocked[2]); // i know, kinda unclean, but it works
};