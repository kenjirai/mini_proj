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
        first:"Authorised singer only",
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
  this.setState({ signerInfo });
  }

openForAll = () => {
  console.log('inside open for all');
  let signerInfo = [];
  this.setState({
    signerInfo: signerInfo,
    openSig:true
  });
}

userConsent = () => {
  if(this.state.signerInfo[0] && this.state.signerInfo[0].address) {
    if (window.confirm('Warning: All entered address will be reset')) {
      this.openForAll();
    }
  }else {
      this.openForAll();
  }
}

handleCallback = (data) => {
    let checkBox = {...this.state.checkBox };
    checkBox.callbackData = data;
    this.setState({
      checkBox:checkBox
    }, () => this.initList());
  }

  initList = () => {
    let singerInfo = this.state.signerInfo;
    let firstCheckBox = this.state.checkBox.name.first;
    let secondCheckBox = this.state.checkBox.name.second;
    let data = {...this.state.checkBox.callbackData };

    //CheckBox component lower case the pass props and before updating state.
    if(data[firstCheckBox.toLowerCase()] && singerInfo.length == 0) {
      this.setState((prevState) => ({
        signerInfo: [...prevState.signerInfo, {address:'', error:''}],
        anyError:false,
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
    const {signerInfo, anyError, openSig} = this.state;
    const firstCheckBox = this.state.checkBox.name.first;
    const secondCheckBox = this.state.checkBox.name.second;

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
                 {this.state.signerInfo.length > 1 ? <button data-id={idx} id={`btn-${signerId}`} className='del-btn' onClick={this.deleteAddress} >Delete</button>: null}
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

//<button id="add-new-btn" onClick={this.addAddress} disabled={anyError}>{this.state.authSignBtn.text}</button>
//<button id="open-for-all" onClick={this.userConsent}> Anyone can sign</button>

export default signerListForm;
