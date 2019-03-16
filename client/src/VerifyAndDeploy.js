import React from 'react';

class VerifyAndDeploy extends React.Component {

  async deploy = () =>  {
    console.log('inside deply');
    const state = this.props.state;
    const contract = state.contract;
    const account = state.account;
    const signData = state.signData;
    const expiryDate = state.expiryDate;
    const signerList = state.signerList;
    const hashOutput = state.hashOutput;
    cl('account', account);
    console.log('expiryDate', expiryDate);
    console.log('hashOutput', hashOutput);
    console.log('signerList', signerList);
    console.log('signedData', signData);
    cl('contract', contract);
    //await contract.methods.set(5).send({ from: accounts[0] });
    await contract.methods.createDocToSign(
      expiryDate,
      signData.signature,
      signerList,
      signData.docHash,
      signData.r,
      signData.s,
      signData.v
    ).send({ from: account});
    
    const response = await contract.methods.getDocData(hashOutput).call();
    cl('response', response);
  }

  render(){
    return(
      <div>
        <h1>Step5: VerifyAndDeploy
      </div>
    );
  }
}
