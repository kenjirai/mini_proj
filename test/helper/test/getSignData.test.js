const Signature = artifacts.require('Signature');
const { should } = require('../setup');
const getSignData = require('../getSignData')

contract('Signature', function([accOne, accTwo]) {
  beforeEach(async function() {
    this.sig = await Signature.new();
    this.msg = 'Bitconnnnnnnnnnneeeecttt, wasssup wassup wassup #$#@';
  });

  describe('it should get accurate signed Address', function() {
    beforeEach(async function() {
      //method personal_sign is not currently supported by Ganache
      this.signMsg = await web3.eth.sign(this.msg, accOne);
      this.signData = await getSignData(this.signMsg, accOne)
    });

    it('returns true if provided signer address is correct', async function() {
      const bool = await (this.sig.verifySignature(
        this.signData.docHash,
        this.signData.r,
        this.signData.s,
        this.signData.v,
        accOne
      ));

      bool.should.be.equal(true);
    });

    it('returns false if provided signer address is incorrect', async function() {
      const bool = await (this.sig.verifySignature(
        this.signData.docHash,
        this.signData.r,
        this.signData.s,
        this.signData.v,
        accTwo
      ));

      bool.should.be.equal(false);
    });
  });
});
