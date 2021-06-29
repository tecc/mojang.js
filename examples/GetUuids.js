// Require Mojang.JS
const MojangJS = require('@tecc/mojang.js');
// Create Mojang client
const mojang = new MojangJS.Mojang.Client();

// Option 1: Single player
// specify player to get uuid for
const player = 'Notch';
// call Client.getUuid function
mojang.getUuid(player)
    .then((data) => {
        console.log(`UUID: ${data.id}, name: ${data.name}`)
    });

// Option 2: Multiple players
// specify list of players to get UUIDs for
const players = ['Notch', 'jeb_', 'Technotype'];
// call Client.getUuids function
mojang.getUuids(players)
    .then((data) => {
        for (let player of data.values()) {
            console.log(`UUID: ${player.id}, name: ${player.name}`);
        }
    })