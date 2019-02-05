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
    this.std = await SignTheDoc.new({
      from: this.creatorAccount
    });
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
    }

    this.signDoc = async function(signerAccount, signerSignedData, modify, value) {
      const depData = deployDoc(
        modify, value, null, signerSignedData, null
      );

      await this.std.signTheDoc(
        this.creatorAccount,
        depData.docHash,
        depData.r,
        depData.s,
        depData.v,
        signerSignedData.signature, {
          from: signerAccount
        }
      );
    }
  });

  describe('signTheDoc', function() {
    beforeEach(async function() {
      this.signerMsg = 'hello world!'
      await this.deploy();
    });

    context('sucessfully publish correct signed data', function() {
      beforeEach(async function() {
        this.signerAddress = accTwo;
        this.signData = await getSignData(this.signerMsg, this.signerAddress);
        this.latestTime = await latest();
        this.tolerance_seconds = new BN(2);

        await this.signDoc(accTwo, this.signData);

        this.docInfo = await this.std.getDocData(this.signData.docHash);
        this.signerInfo = await this.std.getSignerInfo(this.signData.docHash, this.signerAddress);
      });

      it('verifies correct signer address entry', async function() {
        (this.signerInfo.signerAddress).should.be.equal(this.signerAddress);
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

      it('correctly updates whoSigned list with signer address', async function() {
        (this.docInfo.whoSigned.length).should.be.equal(1);
        (this.docInfo.whoSigned[0]).should.be.equal(this.signerAddress);
      });

    }); //---end tag sucessfully registered --->>

    context('invalid document hash', function () {
      beforeEach(async function() {
        this.signerAddress = accThree;
        this.signData = await getSignData(this.signerMsg, this.signerAddress);
        this.mockHash = web3.utils.sha3('ethereum mining rig');
      });

      it('throws for incorrect document hash', async function() {
        await shouldFail.reverting.withMessage(
          this.signDoc(accTwo, this.signData, 'docHash', this.mockHash),
          'Failed to verify document hash.');
      });
    });//---end tag invalid document hash --->>

    context('signer signature validation', function() {
      beforeEach(async function() {
        this.signerAddress = accThree;
        this.signData = await getSignData(this.signerMsg, this.signerAddress);
        this.mockHash = web3.utils.sha3('ethereum is the future');
        this.mockData = await getSignData(this.mockHash, accTwo);
      });

      it('throws if signature data provided by other accounts', async function() {
        //msg.sender is account accTwo
        //signature data is obtained from account accThree
        await shouldFail.reverting.withMessage(
          this.signDoc(accTwo, this.signData),
          'Signature verification failed');
      });

      it('throws for incorrect r, s and v value of ECDSA signature', async function() {
        await shouldFail.reverting.withMessage(
          this.signDoc(accTwo, this.signData, 'r', this.mockData.r),
          'Signature verification failed'
        );

          await shouldFail.reverting.withMessage(
            this.signDoc(accTwo, this.signData, 's', this.mockData.s),
            'Signature verification failed'
          );

          await shouldFail.reverting.withMessage(
            this.signDoc(accTwo, this.signData, 'v', new BN(123)),
            'Signature verification failed'
          );
      }); //----end tag throws for incorrect r, s and v---->
    });//----end tag signer signature validation---->

    context('authorised signer only', function() {
      beforeEach(async function() {
        this.signerAddress = accFive;
        this.signData = await getSignData(this.signerMsg, this.signerAddress);
    });

    it('throws an error for unauthorise singer', async function() {
      await shouldFail.reverting.withMessage(
        this.signDoc(this.signerAddress, this.signData),
        'Provided address not authorised to sign the document.'
      );
    });
  });//---end tag authorised signer only ---->

  }); //----end tag signer signing process---->
});//---END MAIN TAG --->
