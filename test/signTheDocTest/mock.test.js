const SignTheDoc = artifacts.require('SignTheDoc');
const getSignData = require('../helper/getSignData');

contract('SignTheDoc', function([accOne, accTwo, accThree, accFour]) {
  beforeEach(async function() {
    this.std = await SignTheDoc.new();
    this.msg = 'some random stuff'
    this.signData = await getSignData(this.msg, accOne);
    console.log(this.signData.signature);
  });

  describe('check', function() {
    it('just', function() {

    });

  });

});
