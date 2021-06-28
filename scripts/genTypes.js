/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const pkgdir = require('pkg-dir');
const path = require('path');
const child = require('child_process');

const distDir = path.resolve(pkgdir.sync(), 'dist');
const scriptsDir = path.resolve(pkgdir.sync(), 'scripts');
const template = fs.readFileSync(path.resolve(scriptsDir, 'typedefTemplate.template')).toString('utf-8');
const outputName = 'lib.d.ts';

console.log('Resolving files in directory', distDir);
fs.readdir(distDir, (err, files) => {
    if (err) {
        console.error('Error when reading directory', err);
        return;
    }

    files = files.filter((s) => path.extname(s) === '.ts' && s !== outputName);
    console.log('Parsing files: ', ...files);

    const parts = {};
    for (let file of files) {
        const name = file.substr(0, file.length - 5);
        parts[name] = {
            file: file,
            name: name,
            content: fs.readFileSync(path.resolve(distDir, file)).toString('utf-8')
        };
    }

    const definitions = [];
    for (let partName in parts) {
        const part = parts[partName];

        var moduleName = `mojang.js/${partName}`;
        if (partName === 'index') {
            moduleName = 'mojang.js';
        }
        const filteredContent = part.content
            .replaceAll(/declare ?/g, '')
            .replaceAll(/from '\.\//g, 'from \'mojang.js/')
            .split('\n')
            .map((s) => '    ' + s)
            .join('\n');
        definitions.push(template
            .replaceAll('{moduleName}', moduleName)
            .replaceAll('{content}', filteredContent));
    }
    
    console.log(`Generated definitions, writing to dist/${outputName}`);
    const fullContent = definitions.join('\n');
    const outputPath = path.resolve(distDir, 'lib.d.ts');
    fs.writeFile(outputPath, fullContent, { encoding: 'utf-8' }, (err) => {
        if (err) {
            console.error('Error when writing definitions', err);
            return;
        }
        
        console.log('Fixing using ESLint');
        const configPath = path.resolve(pkgdir.sync(), '.eslintrc.js');
        child.exec(`eslint --fix --no-ignore ${outputPath} -c "${configPath}"`,(err) => {
            if (err) {
                console.error('Error when fixing output', err);
                return;
            }
        });
    });
});