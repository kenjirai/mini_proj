import React from "react";
import DatePicker from "react-datepicker";
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default class ExpiryDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      unixDate:null
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

  render() {
    return (
      <section>
      <h2> Step3: Expiry Date </h2>
      <div>
        <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
        showTimeSelect
        timeFormat="h:mm"
        timeIntervals={15}
        dateFormat="d/MM/yyyy h:mm aa"
        minDate={new Date()}
        timeCaption="time"
        />
      </div>
      </section>

    );
  }
}
