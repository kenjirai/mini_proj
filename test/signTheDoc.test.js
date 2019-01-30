const SignTheDoc = artifacts.require('SignTheDoc');
const { BN, should } = require('./helper/setup');
const { eventExist } = require('./helper/getEvents');
const { assertFailure, internalFailWithMsg } = require('./helper/failureUtils');
const { advanceBlock, latest, latestBlock, increase, increaseTo, duration } = require('./helper/time');
const getSignData = require('./helper/getSignData');
const shouldFail = require('./helper/shouldFail');

contract('SignTheDoc', function([accOne, accTwo, accThree, accFour]) {
  beforeEach(async function() {
    this.std = await SignTheDoc.new();
    this.msg = 'hello world!'
    this.signMsg = await web3.eth.sign(this.msg, accOne);
    this.signData = await getSignData(this.signMsg, accOne);
    this.latestBlockTime = await latest();
    this.expiryDate = this.latestBlockTime.add(duration.days(1));
    this.authorisedSignerList = [accTwo, accFour];
  });

  describe('CreateDocToSign', function() {
    //----start tag createDocToSign ---->

    describe('successful deployment of the document data', function() {
      //----successful deployment---->
      beforeEach(async function() {
        await this.std.createDocToSign(
          this.expiryDate,
          this.signData.signature,
          this.authorisedSignerList,
          this.signData.docHash,
          this.signData.r,
          this.signData.s,
          this.signData.v
        );
        this.docInfo = await this.std.getDocData(this.signData.docHash);
      });

      it('records correct creator address', function() {
        (this.docInfo.creatorAddress).should.be.equal(accOne);
      });

      it('records correct creation date', function() {
        (this.docInfo.creationDate)
        .should.be.bignumber.closeTo(this.latestBlockTime, new BN(2));
      });

      it('records correct expiry date', function() {
        (this.docInfo.expiryDate)
        .should.be.bignumber.equal(this.expiryDate);
      });

      it('records correct document hash', function() {
        (this.docInfo.docHash)
        .should.be.equal(this.signData.docHash);
      });

      it('records correct signature', function() {
        (this.docInfo.signature)
        .should.be.equal(this.signData.signature);
      });

      it('records correct authorised signer list', function() {
        (this.authorisedSignerList)
        .should.be.equal(this.authorisedSignerList);
      });

      it('records whoSigned list with empty list', function() {
        (new BN(this.docInfo.whoSigned.length))
        .should.be.bignumber.equal(new BN(0));
      });
      //----end tag successful deployment---->
    });

    describe('deployment should fail for incorrect arguments', function() {
      //----start tag deployment should fail---->
      beforeEach(function () {
        this.newExpiryDate = this.latestBlockTime.sub(new BN(10));
      });

      it('rejects the deployment if the date is already expired', async function(){
        await shouldFail(
            this.std.createDocToSign(
            this.newExpiryDate,
            this.signData.signature,
            this.authorisedSignerList,
            this.signData.docHash,
            this.signData.r,
            this.signData.s,
            this.signData.v
          )
        );
      });

      it('throws an error if failure not raised', async function(){
        await assertFailure(shouldFail(
            this.std.createDocToSign(
            this.expiryDate,
            this.signData.signature,
            this.authorisedSignerList,
            this.signData.docHash,
            this.signData.r,
            this.signData.s,
            this.signData.v
          )
        ));
      });

      it('rejects the deployment with correct message if the date is already expired', async function(){
        await shouldFail.reverting.withMessage(
            this.std.createDocToSign(
            this.newExpiryDate,
            this.signData.signature,
            this.authorisedSignerList,
            this.signData.docHash,
            this.signData.r,
            this.signData.s,
            this.signData.v
          ),
          'contract expiry date should be greater than current time');
      });
      //----end tag successful deployment---->
    });



  });
  //----end tag createDocToSign ---->
});
