import React from "react";
import CheckBox from './CheckBox';
import DatePicker from "react-datepicker";
//import setMinutes from "date-fns/setMinutes";
//import setHours from "date-fns/setHours";
import SignHash from './SignHash';
import cl from './utils/cl';

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

function hasKey(obj, key) {
    if (obj.hasOwnProperty(key))
      cl('yesHasKey', key)
      return true;
  return false;
}

const initialState = {
    startDate: new Date(),
    unixDate:null,
    checkBox:null
  };

export default class ExpiryDate extends React.Component {
    state = initialState;


  componentDidUpdate(prevProps) {
    if(prevProps.signerCheckBox) {
      if(JSON.stringify(prevProps.signerCheckBox) !== JSON.stringify(this.props.signerCheckBox)) {
        this.setState(initialState);
      }
    }
  }

  handleChange = (date) => {
    const unixDate = Math.floor(date/ 1000);
    this.setState({
      startDate: date,
      unixDate: unixDate
    });
  }

  handleCallback = (data) => {
    this.setState({
      checkBox: data
    })
  }
  render() {

    const first = 'yes';
    const second = 'no';

    let datePicker;
    let checkBox = this.state.checkBox;
    let notComMsg = "Complete step:2 to view this content"

    const signerInfo = this.props.signerInfo;

    let hasData;
    const openSig = this.props.openSig;

    if(signerInfo.length > 0 && !signerInfo[0].error) {
      hasData = true;
    } else if(openSig) {
      hasData = true;
    } else {
      hasData = false;
    }

    if(checkBox && checkBox[first]) {
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

    return (
      <div>
      <section>
      <h2> Step3: Expiry Date </h2>
        {hasData? <CheckBox first={first} second={second} checkBoxCallback={this.handleCallback}/> : notComMsg }
      </section>
      {datePicker}
      <SignHash hashOutput={this.props.hashOutput} signerInfo={signerInfo} expiryDate={this.state.unixDate}/>
      </div>
    );
  }
}
