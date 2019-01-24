const { should } = require('./setup')

//dubugging purpose
function cl(outputStr, objName) {
	console.log(`${outputStr} : ${objName}`);
}

async function customThrow(msg) {
	return new Error(msg)
}

async function assertFailure (promise) {
  try {
    await promise;
  } catch (error) {
    return;
  }
  should.fail();
}


module.exports = {
  cl:cl,
  customThrow:customThrow,
  assertFailure:assertFailure
};
