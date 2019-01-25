const { should } = require('../setup');

const shouldFail = require('../shouldFail');

const Failer = artifacts.require('Failer');

const { customThrow, assertFailure } = require('../misc');


async function throwFailWithCustomMsg(msg) {
  throw new Error(msg)
}

describe('shouldFail', function () {
  beforeEach(async function () {
    this.failer = await Failer.new();
  });

  describe('shouldFail', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(shouldFail(this.failer.dontFail()));
    });

    it('accepts a revert', async function () {
      await shouldFail(this.failer.failWithRevert());
    });

    it('accepts a throw', async function () {
      await shouldFail(this.failer.failWithThrow());
    });

    it('accepts an out of gas', async function () {
      await shouldFail(this.failer.failWithOutOfGas({ gas: 2000000 }));
    });
  });

  describe('reverting', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(shouldFail.reverting(this.failer.dontFail()));
    });

    it('accepts a revert', async function () {
      await shouldFail.reverting(this.failer.failWithRevert());
    });

    it('rejects a throw', async function () {
      await assertFailure(shouldFail.reverting(this.failer.failWithThrow()));
    });

    it('rejects an outOfGas', async function () {
      await assertFailure(shouldFail.reverting(this.failer.failWithOutOfGas({ gas: 2000000 })));
    });
  });

  describe('throwing', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(shouldFail.throwing(this.failer.dontFail()));
    });

    it('accepts a throw', async function () {
      await shouldFail.throwing(this.failer.failWithThrow());
    });

    it('rejects a throw', async function () {
      await assertFailure(shouldFail.throwing(this.failer.failWithRevert()));
    });

    it('rejects an outOfGas', async function () {
      await assertFailure(shouldFail.throwing(this.failer.failWithOutOfGas({ gas: 2000000 })));
    });
  });

  describe('outOfGas', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(shouldFail.outOfGas(this.failer.dontFail()));
    });

    it('accepts an out of gas', async function () {
      await shouldFail.outOfGas(this.failer.failWithOutOfGas({ gas: 2000000 }));
    });

    it('rejects a revert', async function () {
      await assertFailure(shouldFail.outOfGas(this.failer.failWithRevert()));
    });

    it('rejects a throw', async function () {
      await assertFailure(shouldFail.outOfGas(this.failer.failWithThrow()));
    });
  });

  describe('outOfGas', function () {
    it('throws an error with accurate error message', async function () {
      await shouldFail.customFail(throwFailWithCustomMsg('bad fail'), 'bad fail');
    });

     it('rejects for incorrect throw message', async function () {
      await assertFailure(shouldFail.customFail(throwFailWithCustomMsg('bad fail'), 'yabadabadooo'));
    });
  });
});
