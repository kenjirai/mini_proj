import React, { Component } from "react";

import SignHash from './SignHash';

class LoadWeb3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      account:null,
      hashResult:null
   };
  }

  render() {
    return (
      <div>
      <SignHash />
      </div>
    );
  }
}

export default LoadWeb3;
