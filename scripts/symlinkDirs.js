/* eslint-disable @typescript-eslint/no-var-requires */
const pkgdir = require('pkg-dir');
const path = require('path');
const fs = require('fs');

const pkgDir = pkgdir.sync();
const modulesDir = path.resolve(pkgDir, 'node_modules');
const moduleDir = path.resolve(modulesDir, '@tecc/mojang.js');
const parent = path.dirname(moduleDir);

function link() {
    fs.symlink(pkgDir, moduleDir, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Symlinked ${moduleDir} to ${pkgDir}`);
    });
}

if (fs.existsSync(moduleDir)) {
    console.log('Link already exists');
} else {
    if (!fs.existsSync(parent)) fs.mkdir(parent, () => { link() })
    else link();
}