import React from "react";
import getSignData  from './utils/getSignData';
import getWeb3 from "./utils/getWeb3";

class SignHash extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        web3: null,
        account: null,
        singerList: null,
        hashOutput: null,
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
        this.setState({
          web3
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
        if (!account) {
          error = {
            msg: `Web3 account is undefined. Install/Login to MetaMask.`,
            hasError: true
          }
        }

        hashOutput = this.props.hashOutput;
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

            const signerData = this.props.signerData;
            if(signerData) {
              signerList = this.makeSignerList(signerData);
            }
            this.setState({ signerList, signData, error });
        }
      }
    }

    makeSignerList(signerData) {
      let signerList = [];
      for (let i = 0; i < signerData.length; i++) {
        if (!signerData[i].error) {
          signerList.push(signerData[i].address);
        };
      }
      return signerList;
    }

    deploy() {

    }

    handleSubmit = (e) => {
      e.preventDefault();
    }

  render() {
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
