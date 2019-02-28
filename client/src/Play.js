import React from 'react';
import CheckBox from './CheckBox';
import Pass from './Pass';

class Play extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:'check'
    };
  }

  handleCallback = (data) => {
    console.log("data", data);
  }

  render() {
    console.log(this.state.data)
    return(
      <div>
        <CheckBox first='first' second='second' checkBoxCallback={this.handleCallback}/>
      </div>
    );
  }
}
//<Pass passCallback={this.handleCallback}/>
export default Play;
