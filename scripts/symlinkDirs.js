/* eslint-disable @typescript-eslint/no-var-requires */
const pkgdir = require('pkg-dir');
const path = require('path');
const fs = require('fs');

const pkgDir = pkgdir.sync();
const modulesDir = path.resolve(pkgDir, 'node_modules');
const moduleDir = path.resolve(modulesDir, 'mojang.js');

fs.symlink(pkgDir, moduleDir, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Symlinked ${moduleDir} to ${pkgDir}`);
})