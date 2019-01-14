const { should } = require('./setup');

async function shouldFailWithMessage (promise, message) {
  try {
   // console.log('inside try');
    await promise;
  } catch (error) {
    //console.log('inside catch');
    //console.log(error);
    //console.log('error message', error.message);
    if (message) {
      error.message.should.include(message, `Wrong failure type, expected '${message}'`);
    }
    return;
  }
  should.fail('Expected failure not received');
}

async function reverting (promise) {
  await shouldFailWithMessage(promise, 'revert');
}

async function throwing (promise) {
  await shouldFailWithMessage(promise, 'invalid opcode');
}

async function outOfGas (promise) {
  await shouldFailWithMessage(promise, 'out of gas');
}

async function shouldFail (promise) {
  await shouldFailWithMessage(promise);
}

shouldFail.reverting = reverting;
shouldFail.throwing = throwing;
shouldFail.outOfGas = outOfGas;

module.exports = shouldFail;
