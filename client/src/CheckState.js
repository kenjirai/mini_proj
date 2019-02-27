import React from 'react';

export default class CheckState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  handleClick = (e) => {
    const hello = {
      one: 1,
      two: 2
    }
    this.setState({hello})
  }

  render() {
    console.log(this.state);
    return(
      <div>
        <h1>hello</h1>
        <button name='test' onClick={this.handleClick}>Check</button>
      </div>
    );
  }
}
