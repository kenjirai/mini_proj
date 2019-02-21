import React from "react";
//import getWeb3 from "./utils/getWeb3";
import getSignData  from './utils/getSignData';

class SignHash extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        web3:this.props.passWeb3,
        account:this.props.mainAccount,
        r: null,
        s: null,
        v: null,
        docHash: null,
        signature: null
      };
    }

    handleClick = async (e) => {
      const web3 = this.state.web3;
      const msg = 'some random stuff';
      const signData = await getSignData(web3, msg, this.state.account);
      this.setState({
        r:signData.r,
        s:signData.s,
        v:signData.v,
        docHash:signData.docHash,
        signature:signData.signature
      });
    }

    handleSubmit = (e) => {
      e.preventDefault();
    }

  render() {
    return (
    <div>
      <button id='sign-hash' onClick={this.handleClick}> Sign </button>
      <p> signature: {this.state.signature} </p>
    </div>
    );
  }
}

export default SignHash;

//sign mock data
//web3 sign the data with metamask
// save the signture
// proceed to sign the real data
