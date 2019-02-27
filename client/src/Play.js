import React from 'react';

class Play extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:'check'
    };
  }

  render() {
    console.log(this.state.data)
    return(
      <div>
        <p> inside render</p>
        {this.state.data}
      </div>
    )
  }
}

export default Play;
