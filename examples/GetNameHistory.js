// Require Mojang.JS
const MojangJS = require('mojang.js');
// Create Mojang client
const mojang = new MojangJS.Mojang.Client();

// specify player to get name history for
const player = '398c7569-3f15-4998-b0d9-be91a9ac935c'; // this is the uuid of the player MarcusSlover
// call Client.getUuid function
mojang.getNameHistory(player)
    .then((data) => {
        console.log(`Current name: ${data.current.name}`);
        console.log('Previous names:')
        for (let entry of data.history) {
            console.log(entry.name);
        }
        // data.uuid also exists for clarification
    });