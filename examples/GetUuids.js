// Require Mojang.JS
const MojangJS = require('mojang.js');
// Create client
const mojang = new MojangJS.MojangClient();

// Approach 1: 1 player
const player = 'Notch';

// A list of players to get UUIDs for
const players = ['Notch', 'jeb_', 'Technotype'];