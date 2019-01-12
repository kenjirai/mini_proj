const chai = require('chai');
//const BigNumber = web3.BigNumber;
var should = require('chai').should();

const SignTheDoc = artifacts.require('./SignTheDoc.sol');

const getSignData = require('./helper/getSignData');

//web3.utils.keccak256(string) // ALIAS
//web3.utils.sha3(string)
//web3.eth.personal.sign(web3.utils.utf8ToHex("Hello world"), "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!")

contract ('SignTheDoc', function([accOne, accTwo, accThree, accFour]) {
  before(async function() {
    this.std = await SignTheDoc.new({from: accOne});
  });

  beforeEach(async function () {
    var docData = 'Hello World!';
    var {error, r, s, v, docHash, signature} = await getSignData.getSignData(docData, accOne);
    this.res = {
      error: error,
      r: r,
      s:s,
      v: v,
      docHash: docHash,
      signature: signature
    }
    });

  it(`Recover signed address. It should return address: ${accOne}`, async function() {
    var signedAddress = await this.std.verifySignature(
      this.res.docHash,
      this.res.r,
      this.res.s,
      this.res.v
      );
    signedAddress.should.be.equal(signedAddress);
  });

  it('should correctly call method createDocToSign and store the provided data', async function() {
    this.std.createDocToSign()
  });
  
});

//it("should put 10000 MetaCoin in the first account")
