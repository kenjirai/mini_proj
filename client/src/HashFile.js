import React from "react";
import { keccak256 } from 'js-sha3';

class HashFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hashOutput:null,
      error:null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    var reader = new FileReader();
    var file = event.target.files[0];
    console.log(file);
    var batch = 1024 * 1024 * 2;
    var start = 0;
    var total = file.size;
    var current = keccak256;
    var self = this;
    reader.onload = function (event) {
      try {
        current = current.update(event.target.result);
        asyncUpdate();
      } catch(e) {
        self.setState({error:e});
      } };
    var asyncUpdate = function () {
      if (start < total) {
        console.log('hashing...' + (start / total * 100).toFixed(2) + '%');
        var end = Math.min(start + batch, total);
        reader.readAsArrayBuffer(file.slice(start, end));
        start = end;
      } else {
        self.setState({hashOutput:current.hex()});
      }
    };
    asyncUpdate();
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="file" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <p> result:{this.state.hashOutput}</p>

    </div>
    );
  }
}

export default HashFile;
