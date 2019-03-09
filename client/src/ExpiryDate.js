import React from "react";
import CheckBox from './CheckBox';
import DatePicker from "react-datepicker";
//import setMinutes from "date-fns/setMinutes";
//import setHours from "date-fns/setHours";
import SignHash from './SignHash';

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

export default class ExpiryDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      unixDate:null,
      checkBox:null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    const unixDate = Math.floor(date/ 1000);
    this.setState({
      startDate: date,
      unixDate: unixDate
    });
  }

  handleCallback = (data) => {
  //console.log('gotCallback', data);
    this.setState({
      checkBox: data
    })
  }
  render() {
    const first = 'Yes';
    const second = 'No';

    let datePicker;
    let checkBox = this.state.checkBox;

    if(!isEmpty(checkBox) && checkBox[first.toLowerCase()]) {
      datePicker = <DatePicker
      selected={this.state.startDate}
      onChange={this.handleChange}
      showTimeSelect
      timeFormat="h:mm"
      timeIntervals={15}
      dateFormat="d/MM/yyyy h:mm aa"
      minDate={new Date()}
      timeCaption="time"
      />
    } else {
      datePicker = null;
    }
    const lowerFirst = first.toLowerCase();
    const lowerSecond = second.toLowerCase();
    return (
      <div>
      <section>
      <h2> Step3: Expiry Date </h2>
      <CheckBox first={first} second={second} checkBoxCallback={this.handleCallback}/>
      </section>
      {datePicker}
      <SignHash expiryDate signData/>
      </div>
    );
  }
}

//Hash file output
