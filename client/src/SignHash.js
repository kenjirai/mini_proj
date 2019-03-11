import React from "react";
import SignTheDoc from "./contracts/SignTheDoc.json";
import getSignData  from './utils/getSignData';
import getWeb3 from "./utils/getWeb3";

import cl from './utils/cl';

class SignHash extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        web3: null,
        account: null,
        contract:null,
        signerList: null,
        hashOutput: null,
        expiryDate:null,
        signData: {
          r: null,
          s: null,
          v: null,
          docHash: null,
          signature: null
        },
        error: {
          msg: null,
          hasError: false
        }
      };
    }

    componentDidMount = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        cl('web3:', web3.version);
        const networkId = await web3.eth.net.getId();
        cl('networkId', networkId);
        const deployedNetwork = SignTheDoc.networks[networkId];
        cl('deploymentNetwork', deployedNetwork);
        const instance = new web3.eth.Contract(
          SignTheDoc.abi,
          deployedNetwork && deployedNetwork.address,
        );
        this.setState({
          web3:web3,
          contract:instance
        });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounsdfsdts, or contract. Check console for details.`,
        );
      }
    };

    handleClick = async (e) => {
      let error = {
        msg: null,
        hasError: false
      };
      let signerList=null;
      let hashOutput; let account; let signData;

      const web3 = this.state.web3;
      if (!web3) {
        error = {
          msg: 'Web3 is undefined. Install/Login to MetaMask.',
          hasError: true
        }
      }

      if (web3) {
        account = await web3.eth.getCoinbase();
        console.log('account', account)
        if (!account) {
          error = {
            msg: `Web3 account is undefined. Install/Login to MetaMask.`,
            hasError: true
          }
        }

        hashOutput = this.props.hashOutput;
        console.log('hashOuput', hashOutput)
        if (!hashOutput && !error.hasError) {
          error = {
            msg: `File Hash is undefined. Proceed to Step1 and choose the appropriate file to get the Hash.`,
            hasError: true
          }
        }

        if(hashOutput && !error.hasError) {
            try {
              signData = await getSignData(web3, hashOutput, account);
            } catch(e) {
              console.log(e)
            }

            const signerInfo = this.props.signerInfo;
            console.log('signerInfo', signerInfo);
            if(signerInfo) {
              signerList = this.makeSignerList(signerInfo);
            }

            const expiryDate = this.props.expiryDate;
            console.log('expiryDate', expiryDate)
            this.setState({ hashOutput, signerList, signData, error, expiryDate, account },
            () => this.deploy());
        }
      }
    }

    makeSignerList(signerInfo) {
      let signerList = [];
      for (let i = 0; i < signerInfo.length; i++) {
        if (!signerInfo[i].error && signerInfo[i].address.length > 0) {
          signerList.push(signerInfo[i].address);
        };
      }
      return signerList;
    }

    //receive hashOutput
    //receive singerList, if received none let anyone sign the document.
    //receive expdate, if received none document will not close for signing.
    //sign the hashoutput
    //deploy above information into the blockchain.

    //check all the data is ready.
    async deploy() {
      console.log('inside deply');
      const state = this.state;
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

    handleSubmit = (e) => {
      e.preventDefault();
    }

  render() {
    //cl('signerInfoProps', this.props.signerInfo);
    return (
    <div>
      <section>
      <h2>Sign the deploy the document</h2>
      {this.state.error.hasError ? this.state.error.msg : null}
      <button id='sign-hash' onClick={this.handleClick}> Sign </button>
      <p> signature: {this.state.signature} </p>
      </section>
      {this.state.hashOutput ? this.state.hashOutput: null}
      {this.state.signData.r}
    </div>
    );
  }
}

export default SignHash;

//sign mock data
//web3 sign the data with metamask
// save the signture
// proceed to sign the real data
