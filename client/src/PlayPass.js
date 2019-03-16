import React from 'react';
import CheckBox from './CheckBox';

const initState = {
  checkBox:null,
  reset:'yes'
}

class PlayPass extends React.Component {
  state = initState;

  componentDidUpdate(prevProps, prevState) {
    if(JSON.stringify(prevProps.passOne) !== JSON.stringify(this.props.passOne)) {
      console.log("inside component did update");
      console.log('prevProps.one', prevProps.passOne);
      console.log('props.one', this.props.passOne);
      this.setState(
        initState, () => this.callmeTest()
      );
    }
  }

  callmeTest() {
    console.log('callmeTEst')
  }
  handleCallback = (data) => {
    let state = {...this.state};
    state.checkBox = data;
    this.setState(state);
  }

  render() {
    //console.log('state:', this.state);
    const rec = this.state.rec;
    return(
      <div>
        count:{this.props.One}
        <CheckBox first='yes' second='no' checkBoxCallback={this.handleCallback} resetState={this.props.passOne}/>
      </div>
    );
  }
}

export default PlayPass;
