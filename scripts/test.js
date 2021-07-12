/* eslint-disable @typescript-eslint/no-var-requires */
const stream = require('stream');
const fs = require('fs');
const path = require('path');
const tests = [
    // general
    'lint', 'prototypes',
    // mojang
    'getUuid', 'getNameHistory', 'getProfile', 'getBlockedServers', 'generateClientToken',
    // yggdrasil
    'yggAuthenticate'
];

let successfulTests = 0;

const stdoutWrite = process.stdout.write.bind(process.stdout);
const stderrWrite = process.stderr.write.bind(process.stderr);
function overrideOutput(stdout, stderr) {
    //return; // see Duplex
    process.stdout.write = stdout.write.bind(stdout);
    process.stderr.write = stderr.write.bind(stderr);
}
function resetOutput() {
    process.stdout.write = stdoutWrite;
    process.stderr.write = stderrWrite;
}

// TODO: Fix writing & reading
function DuplexStream() {
    const duplex = new stream.Duplex({
        write: (chunk, encoding, next) => {
            if (this._buf == null) this._buf = Buffer.alloc(0);
            // stdoutWrite(`write ${chunk.length}\n`);
            const buf = Buffer.alloc(this._buf.length + chunk.length);
            buf.write(this._buf.toString());
            if (Buffer.isBuffer(chunk) && encoding !== 'buffer') buf.write(chunk.toString(encoding));
            this._buf = buf;
            // stdoutWrite(`new size: ${buf.length}\n`);
            next();
        },
        read: (size) => {
            if (!this._buf) return null;
            // stdoutWrite(`read ${size}\n`);
            // stdoutWrite(`_buf: ${this._buf.toString('utf-8')}\n`);
            if (size) {
                return this._buf.toString('utf-8', 0, size);
            }
            return this._buf.toString();
        },
        destroy: () => {
            this._buf = null;
        }

    });
    return duplex;
}

async function runTests() {
    console.log(`RUNNING TESTS [${tests.join(', ')}]`);
    try {
        for (let testName of tests) {
            console.log(`\nRunning test ${testName}`);
            const testStdout = DuplexStream();

            testStdout.setEncoding('utf-8');
            testStdout.write(`--- OUTPUT FOR TEST '${testName}' ---\n\n`);
            testStdout.write('test');
            try {
                const func = require(`./tests/${testName}`);
                if (typeof(func) != 'function') {
                    console.warn(`Test ${testName} is not a function!`);
                    continue;
                }
                overrideOutput(testStdout, testStdout);
                await func();
                resetOutput();
                successfulTests++;
                testStdout.write('\n\n--- END OUTPUT ---');
            } catch (e) {
                resetOutput();
                console.error(`Error running test '${testName}'`, e.toString());
                // console.log('Printing test output');
                // console.log(testStdout.read());
            }
            resetOutput();
            testStdout.uncork();
            testStdout.end();
            testStdout.destroy();
        }
    } catch (e) {
        resetOutput();
        console.log('Error whilst running tests', e);
    }
    console.log('Done with tests...');
}

function done() {
    let unsuccessful = tests.length - successfulTests;
    let success = successfulTests / tests.length;

    const coverage = success * 100;

    console.log('Testing complete');
    console.log(`Successful: ${successfulTests}, unsuccessful: ${unsuccessful}, coverage: ${coverage.toFixed(2)}%`);

    if (success !== 1) {
        console.error('Tests failed, exiting');
        process.exit(1);
    }
}

runTests().finally(done);