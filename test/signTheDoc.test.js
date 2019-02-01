const SignTheDoc = artifacts.require('SignTheDoc');
const { BN, should } = require('./helper/setup');
const { eventExist } = require('./helper/getEvents');
const { assertFailure, internalFailWithMsg } = require('./helper/failureUtils');
const { advanceBlock, latest, latestBlock, increase, increaseTo, duration } = require('./helper/time');
const getSignData = require('./helper/getSignData');
const shouldFail = require('./helper/shouldFail');
const deployDoc = require('./helper/deployDoc');

contract('SignTheDoc', function([accOne, accTwo, accThree, accFour]) {
  beforeEach(async function() {
    this.std = await SignTheDoc.new();
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

  describe('CreateDocToSign', function() {
    describe('successful deployment of the document data', function() {
      beforeEach(async function() {
        await this.deploy();
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
    }); //----end tag successful deployment---->

    describe('deployment should fail for incorrect arguments', function() {
      beforeEach(async function() {
        this.mockExpiryDate = this.latestBlockTime.sub(new BN(10));
        this.mockAccount = await web3.eth.getCoinbase();
        this.mockHash = web3.utils.sha3('yabadabadoooo')
      });

      context('incorrect expiry date', function() {
        it('rejects the deployment if the date is already expired', async function() {
          await shouldFail(this.deploy('expiryDate', this.mockExpiryDate));
        });

        it('throws an error if failure not raised', async function() {
          await assertFailure(shouldFail(this.deploy('expiryDate', this.expiryDate)));
        });

        it('rejects the deployment with correct message if the date is already expired', async function() {
          await shouldFail.reverting.withMessage(this.deploy('expiryDate', this.mockExpiryDate),
            'contract expiry date should be greater than current time');
        });
      }); //----end tag incorrect expiry date---->

      describe('verifySignature', function() {
        beforeEach(async function() {
          this.mockHash = web3.utils.sha3('yabadabadoooo')
          this.mockData = await getSignData(this.mockHash, accTwo)
          this.errorMsg = "Signature verification failed"
        });

        it('throws an error for incorrect hash', async function() {
          await shouldFail.reverting.withMessage(
            this.deploy('docHash', this.mockHash),
            this.errorMsg
          );
        });

        it('throws an error for incorrect r value of ECDSA signature ', async function() {
          await shouldFail.reverting.withMessage(
            this.deploy('r', this.mockData.r),
            this.errorMsg
          );
        });

        it('throws an error for incorrect s value of ECDSA signature ', async function() {
          await shouldFail.reverting.withMessage(
            this.deploy('s', this.mockData.s),
            this.errorMsg
          );
        });

        it('throws an error for incorrect recovery id, v value ', async function() {
          await shouldFail.reverting.withMessage(
            this.deploy('v', this.mockData.v),
            this.errorMsg
          );
        });

      }); //----end tag verifySignature--->

    }); //----end tag deployment should fail---->

  }); //----end tag createDocToSign ---->

}); //===========MAIN TAG END===========>
