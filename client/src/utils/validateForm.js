function isAddressValid(address) {
  const myRe = /^0x[a-fA-F0-9]{40}$/;
  if(myRe.test(address)) {
      return true;
  } else {
      return false;
  }
}

function hasSpace(value){
  const myRe = /\s/g;
  if(myRe.test(value)) {
    return true;
  } else {
    return false;
  }
}

function isAddressUnique(signerInfo, address) {
  for(let i=0; i < signerInfo.length; i++) {
    if (signerInfo[i].address === address) {
      return false;
    }
  }
  return true;
}
