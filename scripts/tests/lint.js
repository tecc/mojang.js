/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = async () => {
    const child_process = require('child_process');
    const path = require('path');
    const pkgdir = require('pkg-dir');

    const packageDir = pkgdir.sync();
    const eslintrcFile = path.resolve(packageDir, '.eslintrc.js');

    console.log('Linting...');
    try {
        const output = child_process.execSync(`eslint --config ${eslintrcFile}`, {
            cwd: packageDir
        });
        console.log('Output from linting\n', output.toString('utf-8'));
    } catch (e) {
        console.error('Error when linting', e);
        if (e.status) {
            process.exit(e.status);
        } else {
            process.exit(1);
        }
    }

}