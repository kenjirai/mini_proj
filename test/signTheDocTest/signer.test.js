const SignTheDoc = artifacts.require('SignTheDoc');
const { BN, should } = require('../helper/setup');
const { eventExist } = require('../helper/getEvents');
const { assertFailure, internalFailWithMsg } = require('../helper/failureUtils');
const { advanceBlock, latest, latestBlock, increase, increaseTo, duration } = require('../helper/time');
const getSignData = require('../helper/getSignData');
const shouldFail = require('../helper/shouldFail');
const deployDoc = require('../helper/deployDoc');

contract('SignTheDoc', function([accOne, accTwo, accThree, accFour]) {
  beforeEach(async function() {
    this.std = await SignTheDoc.new({from:accOne});
    this.msg = 'hello world!'
    this.signMsg = await web3.eth.sign(this.msg, accOne);
    this.signData = await getSignData(this.signMsg, accOne);
    this.latestBlockTime = await latest();
    this.expiryDate = this.latestBlockTime.add(duration.days(1));
    this.authorisedSignerList = [accTwo, accFour];

    this.deploy = async function(modify, value) {
      const depData = deployDoc(
        modify, value, this.expiryDate, this.signData, this.authorisedSignerList
      );

      await this.std.createDocToSign(
        depData.expiryDate,
        depData.signature,
        depData.authorisedSignerList,
        depData.docHash,
        depData.r,
        depData.s,
        depData.v);
    }
  });


  // check if the correct document hash is open for signature.

  describe('Signer Signing process', function() {
    beforeEach(async function() {
      await this.deploy();
    });

    describe('Sucessfully registered signed data', function() {
      beforeEach(async function() {
        this.signerAddress = accTwo;
        this.signerMsg = 'hello world!';
        this.signData = await getSignData(this.signerMsg, this.signerAddress);
        this.latestTime = await latest();
        this.tolerance_seconds = new BN(2);

        await this.std.signTheDoc(
          this.signData.docHash,
          this.signData.r,
          this.signData.s,
          this.signData.v,
          this.signData.signature,
          {from:accTwo}
        );

        this.signerInfo = await this.std.getSignerInfo(this.signData.docHash, this.signerAddress);
      });

      it('verifies correct document hash entry', async function() {
        (this.signerInfo.docHash).should.be.equal(this.signData.docHash);
      });

      it('verifies correct signature entry', async function() {
        (this.signerInfo.signature).should.be.equal(this.signData.signature);
      });

      it('verifies correct signed time entry', async function() {
        (this.signerInfo.signedDate).should.be.bignumber.closeTo(this.latestTime, this.tolerance_seconds);
      });
    });

  });
});


// check if the correct document hash is open for signature.
// check the hash with creator address.
// check if the signer is authorise to sign.
// if the signer is authorised to sign than proceed
// if the signer is not authorise to sign than reject the deployment
// check if it's correctly registered.
