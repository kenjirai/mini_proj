async function getSignData(docData, account) {
  var docHash = await web3.utils.keccak256(docData);
  var signature = await web3.eth.sign(docHash, account);
  signature = signature.substr(2); //remove 0x
  const r = '0x' + signature.slice(0, 64)
  const s = '0x' + signature.slice(64, 128)
  var v = '0x' + signature.slice(128, 130)
  //console.log('v', v);
  var v_decimal = web3.utils.toDecimal(v)

  if (v_decimal < 27) {
    v_decimal += 27;
  }

  //console.log('v_decimal', v_decimal);

  if (v_decimal != 27 && v_decimal != 28) {
    return {
      error: new Error('V should be either 27 or 28')
    }
  }

  return {
    r: r,
    s: s,
    v: v_decimal,
    docHash: docHash,
    signature: signature
  }

}

module.exports = getSignData;
