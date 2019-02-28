import React from 'react';


class Pass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:'check'
    };
  }

  handleClick = (e) => {
    this.props.passCallback(this.state.data)
  }

  render() {
    return(
      <div>
        <button onClick={this.handleClick}>Button</button>
      </div>
    )
  }
}

export default Pass;
