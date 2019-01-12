Web3 = require('web3');

const provider = new Web3.providers.HttpProvider(
  "http://127.0.0.1:7545"
);

const web3 = new Web3(provider);

function process() {
  message = 'codingRhino'
  signature = "0xd6142143bd3e0bd39950688ace7037eab045f7c1c29e73912884701276be87130e727f2247a25581f9708df019285a03b9f1e3a9acbea7d46eb917e4c52c05321b"
  signature = signature.substr(2); //remove 0x
  const r = '0x' + signature.slice(0, 64)
  const s = '0x' + signature.slice(64, 128)
  const v = '0x' + signature.slice(128, 130)
  const v_decimal = web3.toDecimal(v)
  return (r,s,v_decimal)
}

console.log(web3);
