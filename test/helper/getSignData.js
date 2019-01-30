const { BN } = require('./setup');

async function getSignData(docData, account) {
  var docHash = await web3.utils.keccak256(docData);
  var signature = await web3.eth.sign(docHash, account);
  //console.log('sigLenght', signature.length)
  //Remove 0x prefix
  signature = signature.substr(2);
  const r = '0x' + signature.slice(0, 64)
  //console.log('r', r.length);
  const s = '0x' + signature.slice(64, 128)
  //console.log('s', s.length);
  const v = '0x' + signature.slice(128, 130)
  //console.log('v', v.length);
  var v_decimal = web3.utils.toDecimal(v)

  //add 0x prefix
  signature = '0x' + signature;

  if (v_decimal < 27) {
    v_decimal += 27;
  }

  if (v_decimal != 27 && v_decimal != 28) {
    return {
      error: new Error('V should be either 27 or 28')
    }
  }

  return {
    r: r,
    s: s,
    v: new BN(v_decimal),
    docHash: docHash,
    signature: signature
  }
}

module.exports = getSignData;
