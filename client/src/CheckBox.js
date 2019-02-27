import React from 'react';

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

function hasKey(obj, key) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(key))
      return true;
  }
  return false;
}

function setRestFalse(obj, setKey) {
  for (var key in obj) {
    if (key != setKey) {
      obj[key] = false
    }
  }
  return obj;
}

class CheckBox extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        checkBox: {}
      };
      this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
      const name = event.target.name;

      var state = {
        ...this.state.checkBox
      };

      let updateState;
      let newState;

      if (isEmpty(state)) {
        newState = {
          [name]: true
        }
        this.setState({
          checkBox: newState
        });
      } else if (!hasKey(state, name)) {
        state[name] = true;
        newState = setRestFalse(state, name);
        this.setState({
          checkBox: newState
        });
      } else if (!state[name]) {
        state[name] = true;
        newState = setRestFalse(state, name);
        this.setState({
          checkBox: newState
        });
      }
    }
  render() {
    return (
      <form>
        <label>
          Yes:
          <input
            name={this.props.first}
            type="checkbox"
            checked={this.state.checkBox[this.props.first] === undefined ? false : this.state.checkBox[this.props.first]}
            onChange={this.handleInputChange} />
        </label>
        <br/>
        <label>
          No:
          <input
            name={this.props.second}
            type="checkbox"
            checked={this.state.checkBox[this.props.second] === undefined ? false : this.state.checkBox[this.props.second]}
            onChange={this.handleInputChange} />
        </label>
        <br />
      </form>
    );
  }
}

export default CheckBox;
