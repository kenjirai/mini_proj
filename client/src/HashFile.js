import React from "react";
import { keccak256 } from 'js-sha3';
import SignerListForm from './SignerListForm';

const initialState = {
  hashOutput: '',
  error: ''
}

class HashFile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    handleChange = (event) => {
      let reader = new FileReader();
      const file = event.target.files[0];
      const batch = 1024 * 1024 * 2;
      let start = 0;
      const total = file.size;
      let current = keccak256;
      const self = this;
      let hashMsg;
      let end;

      reader.onload = function(event) {
        try {
          current = current.update(event.target.result);
          asyncUpdate();
        } catch (e) {
          console.log('error', e)
        }
      };

      var asyncUpdate = function() {
        if (total === 0) {
          self.setState({
            error:`file size needs to be greater than 0 byte`
          });
        } else if (start < total && total > 0) {
          /*
          hashMsg = `hashing...${(start / total * 100).toFixed(2)} %`;
          self.setState({
            hashOutput: hashMsg
          });
          */
          end = Math.min(start + batch, total);
          reader.readAsArrayBuffer(file.slice(start, end));
          start = end;
        } else {
          self.setState({
            hashOutput: '0x' + current.hex()
          });
        }
      };
      asyncUpdate();
    }

  render() {
    return (
      <div>
        <section>
          <h2> Step1: Hash the File </h2>
      <form>
        <label>
         Select a File:
          <input type="file" onChange={this.handleChange} />
        </label>
          <span id="hash-output">Hash Output:{this.state.hashOutput ? this.state.hashOutput:'Choose file to begain'}</span>
      </form>
      </section>
      <SignerListForm hashOutput={this.state.hashOutput}/>
    </div>
    );
  }
}

export default HashFile;
