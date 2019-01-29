const SignTheDoc = artifacts.require('SignTheDoc');
const { BN, should } = require('./helper/setup');
const { eventExist } = require('./helper/getEvents');
const { assertFailure, internalFailWithMsg } = require('./helper/failureUtils');
const { advanceBlock, increase, increaseTo, duration } = require('./helper/time');
const getSignData = require('./helper/getSignData');

contract('SignTheDoc', function ([accOne, accTwo, accThree, accFour]) {
  beforeEach(async function () {
    this.std = await SignTheDoc.new();
    this.msg = 'hello world!'
  });

  describe('CreateDocToSign', function () {
    describe('Document creation process', function() {
      beforeEach(async function () {
        this.signMsg = await web3.eth.sign(this.msg, accOne);
        this.signData = await getSignData(this.signMsg, accOne)

        this.expiryDate = duration.days(1);
        this.authorisedSignerList = [accTwo, accFour];

        this.std.createDocToSign(
          this.expiryDate,
          this.signData.signature,
          this.authorisedSignerList,
          this.docHash,
          this.signData.r,
          this.signData.s,
          this.signData.v
        );
      });

      it('properly register new documents for the creator', async function() {
        console.log(this.signData)
        const docInfo = await this.std.getAutorisedSingingList(this.signData.docHash);
      });
    });
  });
});
