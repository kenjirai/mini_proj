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
      return true;
  return false;
}

const initialState = {
    startDate: new Date(),
    unixDate:null,
    checkBox: {
      name: {
        first: 'yes',
        second: 'no'
      },
      callbackData:null
    },
    includeDate:null
  };

export default class ExpiryDate extends React.Component {
  state = initialState;

  handleChange = (date) => {
    const unixDate = Math.floor(date/ 1000);
    this.setState({
      startDate: date,
      unixDate: unixDate
    });
  }

  handleCallback = (data) => {
    let state = {...this.state};
    state.checkBox.callbackData = data;
    this.setState(state);
  }

  render() {
    const data = this.props.signerChkBx;
    let datePicker;
    let checkBox = this.state.checkBox;
    let notComMsg = "Complete step:2 to view this content";

    console.log('callback CheckBox data', checkBox.callbackData);

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

    //Get checkBox first label which is set to sring type 'yes';
    const firstLabel = checkBox.name.first;

    //Get checkBox first label which is set to sring type 'no';
    const secondLabel = checkBox.name.second;

    const chkBxData = checkBox.callbackData;

    let firstValue; let secondValue;

    if(chkBxData) {
      if(hasKey(chkBxData, firstLabel)) {
        firstValue = chkBxData[firstLabel];
      }

      if(hasKey(chkBxData, secondLabel)) {
        secondValue = chkBxData[secondLabel];
      }
    }

    //cl('firstValue', firstValue);
    //cl('secondValue', secondValue);
    //cl('signerList props from exp', this.props.signerChkBx);
    //cl('expiryDate checkBox:', this.state.checkBox.callbackData);

    if(firstValue) {
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
        {hasData? <CheckBox first={firstLabel} second={secondLabel} checkBoxCallback={this.handleCallback} resetState={this.props.signerChkBx}/> : notComMsg }
      </section>
      {datePicker}
      <SignHash hashOutput={this.props.hashOutput} signerInfo={signerInfo} expiryDate={this.state.unixDate} includeDate={this.state.includeDate}/>
      </div>
    );
  }
}
