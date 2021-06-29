/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const pkgdir = require('pkg-dir');
const path = require('path');

const targets = [
    {
        target: '(./LICENSE.txt)',
        replacement: '{@page License}'
    },
    {
        target: '(./examples)',
        replacement: '{@page List of examples}'
    }
];

const packageDir = pkgdir.sync();
const inputFile = path.resolve(packageDir, 'README.md');
const outputFile = path.resolve(packageDir, 'docs-extra/Index.md');
fs.readFile(inputFile, (err, data) => {
    if (err) {
        console.error('Error when reading input file', err);
        return;
    }
    var fixed = data.toString('utf-8');
    for (const target of targets) {
        fixed = fixed.replaceAll(target.target, target.replacement);
    }

    fs.writeFile(outputFile, fixed, (err) => {
        if (err) {
            console.error('Error when writing output file', err);
            return;
        }
    });
});