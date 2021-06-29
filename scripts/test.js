/* eslint-disable @typescript-eslint/no-var-requires */
const tests = ['lint', 'prototypes', 'getUuid'];

let successfulTests = 0;

async function runTests() {
    console.log(`RUNNING TESTS [${tests.join(', ')}]`);
    for (let testName of tests) {
        console.log(`\nRunning test ${testName}`);
        try {
            const func = require(`./tests/${testName}`);
            if (typeof(func) != 'function') {
                console.warn(`Test ${testName} is not a function!`);
                continue;
            }
            await func();
            successfulTests++;
        } catch (e) {
            console.error(`Error running test '${testName}'`, e.toString());
        }
    }
}

runTests().then(() => {
    let unsuccessful = tests.length - successfulTests;
    let success = successfulTests / tests.length;

    const coverage = success * 100;

    console.log('Testing complete');
    console.log(`Successful: ${successfulTests}, unsuccessful: ${unsuccessful}, coverage: ${coverage.toFixed(3)}%`);

    if (success !== 1) {
        console.error('Tests failed, exiting');
        process.exit(1);
    }
});