const SignTheDoc = artifacts.require('SignTheDoc');
const { BN, should } = require('../helper/setup');
const { eventExist } = require('../helper/getEvents');
const { assertFailure, internalFailWithMsg } = require('../helper/failureUtils');
const { advanceBlock, latest, latestBlock, increase, increaseTo, duration } = require('../helper/time');
const getSignData = require('../helper/getSignData');
const shouldFail = require('../helper/shouldFail');
const deployDoc = require('../helper/deployDoc');

contract('SignTheDoc', function([accOne, accTwo, accThree, accFour, accFive]) {
  beforeEach(async function() {
    this.creatorAccount = accOne;
    this.std = await SignTheDoc.new();
    this.msg = 'hello world!'
    this.signData = await getSignData(this.msg, this.creatorAccount);
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
        depData.v, {
          from: this.creatorAccount
        });
    }//---end tag beforeEach---//

    this.signDoc = async function(signerAccount, signerSignedData, modify, value) {
      const depData = deployDoc(
        modify, value, null, signerSignedData, null
      );
      await this.std.signTheDoc(
        accOne,
        depData.docHash,
        depData.r,
        depData.s,
        depData.v,
        depData.signature, {
          from: signerAccount
        }
      );
    }
  });

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


        this.docInfo = await this.std.getDocData(this.signData.docHash);
        console.log(this.docInfo)

      });

      it('verifies correct signer address entry', async function() {

      });

    }); //---end tag sucessfully registered --->>
  }); //---end tag signer signing process --->>
});//---END MAIN TAG --->
