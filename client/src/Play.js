import React from 'react';
import PlayPass from './PlayPass';

class Play extends React.Component {
  state = {
    data: {
      count:0,
      test:null,
      update:null
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState.data) !== JSON.stringify(this.state.data)) {
      const state = {...this.state }
      console.log('state', state)
      state.data.test ='yes';
      this.setState(state, () => this.updateState());
    }
  }

  updateState() {
    console.log('hello from update state');
    const state = {...this.state }
    state.data.update = 'hey'
    this.setState(state)
  }

  handleChange = () => {
    const data = { ...this.state.data }
    const count = data.count;
    data.count = count + 1;

    this.setState({
      data:data
    });

    /*
    this.setState((prevState) => ({
      one: prevState.one + 1
    }));
    */
  }

  render() {
    const count = this.state.data.count;
    console.log('state', this.state);
    return(
      <div>
      <h2> hello world </h2>
      <button onClick={this.handleChange}>ClickMe </button>
    {count}
    {this.state.data.test}
      <PlayPass passOne={count}/>
      </div>
    );
  }
}

export default Play;
