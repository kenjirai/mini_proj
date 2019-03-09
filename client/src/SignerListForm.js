import React from "react";
import SignHash from './SignHash';
import ExpiryDate from './ExpiryDate';
import CheckBox from './CheckBox';

function isAddressValid(address) {
  const myRe = /^0x[a-fA-F0-9]{40}$/;
  if(myRe.test(address)) {
      return true;
  } else {
      return false;
  }
}

function hasSpace(value){
  const myRe = /\s/g;
  if(myRe.test(value)) {
    return true;
  } else {
    return false;
  }
}

function isAddressUnique(signerInfo, address) {
  for(let i=0; i < signerInfo.length; i++) {
    if (signerInfo[i].address === address) {
      return false;
    }
  }
  return true;
}

class signerListForm extends React.Component {
  state = {
    signerInfo: [],
    //Default set to true to disable add new signer list button.
    anyError:true,
    //Default set to true for allowing anyone to sign the document.
    openSig:true,
    checkBox: {
      name: {
        first:"Authorised signer only",
        second:"Anyone can sign"
      },
      callbackData:null
    }
  }

handleChange = (e) => {
  let signerInfo = [...this.state.signerInfo];
  const targetId = e.target.dataset.id;
  const className = e.target.className;
  const error = 'error';
  const address = e.target.value;
  const validate = this.validateForm(address, signerInfo);
  signerInfo[targetId][error] = validate.errorMsg;
  this.setState({ anyError:validate.anyError });
  signerInfo[targetId][className] = address.trim();
  this.setState({ signerInfo });
}

validateForm(value, state) {
  //remove any first and last space
  const signerAddress= value.trim();
  const prefix = signerAddress.slice(0,2);
  if( prefix !== "0x") {
    return {
      errorMsg:'address must start with 0x prefix.',
      anyError: true
    };
  } else if(hasSpace(signerAddress)) {
    return {
      errorMsg:'address should not contain any space character.',
      anyError:true
    };
  } else if(value.length !== 42) {
    return {
      errorMsg:'address length should be 42 including 0x prefix at the front.',
      anyError:true
    };
  } else if(!isAddressValid(signerAddress)) {
    return {
      errorMsg:'address should be in correct hex format.',
      anyError:true
    };
  } else if(state.length > 1) {
      if(!isAddressUnique(state, signerAddress)) {
        return {
          errorMsg:`duplicate address ${signerAddress} already exist.`,
          anyError:true
        };
      } else {
        return {
          errorMsg:'',
          anyError:false
        };
      }
  } else {
    return {
      errorMsg:'',
      anyError:false
    };
  }
}

addAddress = (e) => {
    this.setState((prevState) => ({
      signerInfo: [...prevState.signerInfo, {address:'', error:''}]
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
    //Setting state openSig to true will hide the Add New Signer button.
    let openSig = true;

    //Also Disable Add New Signer button.
    let anyError = true;
    this.setState({
      signerInfo:signerInfo,
      openSig:openSig,
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
//State openSig boolean value is use to hide/show Add New Signer button.
openForAll = () => {
  let signerInfo = [];
  this.setState({
    signerInfo: signerInfo,
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
    const openSig = false;

    //Render the first signer List form.
    //CheckBox Component lower case the passed props before updating state.
    if(data[firstCheckBox.toLowerCase()] && singerInfo.length == 0) {
      this.setState((prevState) => ({
        signerInfo: [...prevState.signerInfo, {address:'', error:''}],
        anyError:anyError,
        openSig:openSig
      }));
    } else if(data[secondCheckBox.toLowerCase()]){
      this.userConsent();
    }
  }

handleSubmit = (e) => {
   e.preventDefault();
 }

render() {
    const {signerInfo, anyError, openSig, checkBox} = this.state;
    const firstCheckBox = checkBox.name.first;
    const secondCheckBox = checkBox.name.second;

    let addNewBtn;

    if(!openSig) {
      addNewBtn = <button id="add-new-btn" onClick={this.addAddress} disabled={anyError}>Add new signer</button>;
    } else {
      addNewBtn = null;
    }
    return (
      <div>
      <section>
        <h2>Step2: Who can sign the document?</h2>
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
        <CheckBox first={firstCheckBox} second={secondCheckBox} checkBoxCallback={this.handleCallback}/>
        {addNewBtn}
      </section>
      <ExpiryDate/>
      </div>
    );
  }
}

export default signerListForm;
