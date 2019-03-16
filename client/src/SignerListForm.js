import React from "react";
import ExpiryDate from './ExpiryDate';
import CheckBox from './CheckBox';
import cl from './utils/cl';

import validateForm from './utils/validateForm';

const initialState = {
  signerInfo: [],
  //Default set to true to disable add new signer list button.
  anyError:true,
  //Default set to true to hide Add New Button.
  displayAddBtn:true,
  checkBox: {
    name: {
      first:"authorised signer only",
      second:"anyone can sign"
    },
    callbackData:null
  },
  openSig:false
}

class signerListForm extends React.Component {
  state = initialState;

componentDidUpdate(prevProps, prevState) {
    if(prevProps.hashOutput !== this.props.hashOutput) {
        this.setState(initialState);
    }
}

handleChange = (e) => {
  let signerInfo = [...this.state.signerInfo];
  const targetId = e.target.dataset.id;
  //form className is 'address'
  const className = e.target.className;
  const error = 'error';
  const address = e.target.value;
  const validate = validateForm(address, signerInfo);
  signerInfo[targetId][className] = address.trim();
  signerInfo[targetId][error] = validate.errorMsg;

  this.setState({
    signerInfo:signerInfo,
    anyError:validate.anyError
    });
}

addAddress = (e) => {
    //Since address is empty therefore error is set to true
    //During program execution error will be set to empty string if address is valid.
    const initState = {
      address:'',
      error:true
    }
    this.setState((prevState) => ({
      signerInfo: [...prevState.signerInfo, initState]
    }));
  }

deleteAddress = (e) => {
  let signerInfo = [...this.state.signerInfo];
  signerInfo.splice(e.target.dataset.id, 1);

  //Let anyone sign the document if all address is deleted.
  if(signerInfo.length == 0) {
    let checkBox = { ...this.state.checkBox };

    //CheckBox Component lower case the passed props before updating state.
    // It is store as key inside state object.
    let firstCheckBox  = checkBox.name.first.toLowerCase();
    let secondCheckBox = checkBox.name.second.toLowerCase();

    //Restore to default checkBox settings.
    //CheckBox Label: "Authorised signer only" will set to false.
    //CheckBox Label: "Anyone can sign" will set to false.
    checkBox.callbackData[firstCheckBox] = false;
    checkBox.callbackData[secondCheckBox] = true;

    //Let anyone sign the document.
    //Setting state displayAddBtn to true will hide the Add New Signer button.
    let displayAddBtn = true;

    //Also Disable Add New Signer button.
    let anyError = true;
    this.setState({
      signerInfo:signerInfo,
      displayAddBtn:displayAddBtn,
      checkBox: checkBox,
      anyError: anyError
    });
  } else {
    this.setState({
      signerInfo: signerInfo
    });
  }
}

//Let any one sign the document.
//State displayAddBtn boolean value is use to hide/show Add New Signer button.
openForAll = () => {
  let signerInfo = [];
  this.setState({
    signerInfo: signerInfo,
    displayAddBtn:true,
    openSig:true
  });
}

//Ask for user permission to remove the provided address from the list before
//letting anyone to sign the document.
userConsent = () => {
  if(this.state.signerInfo[0] && this.state.signerInfo[0].address) {
    if (window.confirm('Warning: All entered address will be reset')) {
      this.openForAll();
    }
  }else {
      this.openForAll();
  }
}

//Receive callback data from child Component CheckBox.
handleCallback = (data) => {
    let checkBox = {...this.state.checkBox };
    checkBox.callbackData = data;

    this.setState({
      checkBox:checkBox
    }, () => this.checkBoxLogic());

  }

  checkBoxLogic = () => {
    const state = this.state;
    const singerInfo = state.signerInfo;
    const firstCheckBox = state.checkBox.name.first;
    const secondCheckBox = state.checkBox.name.second;
    const data = {...state.checkBox.callbackData };

    //Enable Add New Signer button.
    const anyError = false;
    //Show Add New Signer button.
    const displayAddBtn = false;

    //Render the first signer List form.
    //CheckBox Component lower case the passed props before updating state.
    if(data[firstCheckBox.toLowerCase()] && singerInfo.length == 0) {
      this.setState((prevState) => ({
        //Error is set to true because empty address is consider invalid.
        signerInfo: [...prevState.signerInfo, {address:'', error:true}],
        anyError:anyError,
        displayAddBtn:displayAddBtn,
        openSig:false
      }));
    } else if(data[secondCheckBox.toLowerCase()]){
      this.userConsent();
    }
  }

handleSubmit = (e) => {
   e.preventDefault();
 }

render() {
    const {signerInfo, anyError, displayAddBtn, checkBox} = this.state;
    const firstCheckBox = checkBox.name.first;
    const secondCheckBox = checkBox.name.second;
    let secondStatus;
    let firstStatus;

    const notComMsg = 'Complete step: 1 to view this content';

    let addNewBtn;

    if(!displayAddBtn) {
      addNewBtn = <button id="add-new-btn" onClick={this.addAddress} disabled={anyError}>Add new signer</button>;
    } else {
      addNewBtn = null;
    }

    let chkBxData = checkBox.callbackData;

    return (
      <div>
      <section>
        <h2>Step2: Who can sign the document?</h2>
        <div id="check-box-comp">
          {this.props.hashOutput? <CheckBox first={firstCheckBox} second={secondCheckBox} checkBoxCallback={this.handleCallback} resetState={this.props.hashOutput}/>:notComMsg}
        </div>
        <br/>
        <form onSubmit={this.handleSubmit}>
          {
            signerInfo.map((val, idx)=> {
              const signerId = `signer-${idx}`;
              return (
                <div key={idx}>
                  <label htmlFor={signerId}>{`signer #${idx + 1}`}</label>
                  <input
                    type="text"
                    name={signerId}
                    data-id={idx}
                    id={signerId}
                    value={signerInfo[idx].address}
                    className="address"
                    onChange={this.handleChange}
                  />
                 <span id={`error-${idx}`}style={{color: "red"}}>{signerInfo[idx].error}</span>
                 {this.state.signerInfo.length >= 0 ? (
                     <button data-id={idx} id={`btn-${signerId}`} className='del-btn' onClick={this.deleteAddress} >Delete</button>
                   ): (
                     null
                   )}
                </div>
              );
            })
          }
        </form>
        <div id="add-new-btn">
            {addNewBtn}
        </div>
      </section>
      <ExpiryDate hashOutput={this.props.hashOutput} signerInfo ={signerInfo} signerChkBx= {chkBxData} openSig={this.state.openSig}/>
      </div>
    );
  }
}

export default signerListForm;
