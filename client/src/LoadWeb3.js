import React, { Component } from "react";
import HashFile from './HashFile';
import getWeb3 from "./utils/getWeb3";
import InputFoo from './InputFoo';
import SignerListForm from './SignerListForm';
import SignHash from './SignHash';

class LoadWeb3 extends Component {
  state = {
  web3: null,
  account:null,
  hashResult:null
 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const account = await web3.eth.getCoinbase();

      this.setState({account, web3});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleData = (key, data) => {
    this.setState({
      [key]: data
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <div id="hash-file">
        <h2> Step 1: Hash The File </h2>
          <HashFile hashResult={this.handleData} />
        </div>

        <div id="add-signer">
        <h2> Step 2: Add signer </h2>
          {this.state.hashResult ? <SignerListForm />:null}
        </div>

        <div id="sign-submit">
        <h2> Step 3: Sign and create document</h2>
          <SignHash />
        </div>
      </div>
    );
  }
}

export default LoadWeb3;
