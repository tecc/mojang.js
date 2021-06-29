/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = async function () {
    const MojangJS = require('mojang.js');
    const mojang = new MojangJS.Mojang.Client();

    const player = 'Notch';
    console.log(`Getting UUID for single player: ${player}`);
    const spResponse = await mojang.getUuid(player);
    console.log('Received', spResponse);

    // A list of players to get UUIDs for
    const players = ['Notch', 'jeb_', 'Technotype'];
    console.log(`Getting UUIDs for multiple players: ${players.join(', ')}`);
    const map = await mojang.getUuids(players);
    console.log('Received', map.values());
};