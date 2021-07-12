/* eslint-disable @typescript-eslint/no-var-requires */
const username = process.env['MJS_USERNAME'];
const password = process.env['MJS_PASSWORD'];
console.log(username);
module.exports = async function () {
    if (!username || !password) {
        console.log('No username/password provided, skipping');
        return;
    }

    const MojangJS = require('@tecc/mojang.js');
    const yggdrasil = new MojangJS.YggdrasilClient();
    const result = await yggdrasil.authenticate(username, password, true);
    console.log(`Authenticated to user ${result.user.username}`);
};