import React from "react";
import SignHash from './SignHash';
import ExpiryDate from './ExpiryDate';

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
    anyError:null,
    open: {
      bool:false,
      msg:"Only authorised Signer can sign the document"
    },
    authSignBtn: {
      text:'Only Authorised Signer',
      click: false
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
    this.buttonManage();
    this.setState((prevState) => ({
      signerInfo: [...prevState.signerInfo, {address:'', error:''}]
    }));
  }

buttonManage() {
  let open = {...this.state.open};
  let authSignBtn = {...this.state.authSignBtn.click};

  if(open.bool) {
    open.bool = false
    this.setState({
      open:open
    });
  }

  if(!authSignBtn.click) {
    authSignBtn.click = true;
    authSignBtn.text="Add New Signer";
    this.setState({
      authSignBtn:authSignBtn
    });
  }

  if(authSignBtn.click && authSignBtn.text==="Add New Signer") {
    this.setState({
      anyError:true
    })
  }
}

deleteAddress = (e) => {
  let signerInfo = [...this.state.signerInfo];
  signerInfo.splice(e.target.dataset.id, 1);
  this.setState({ signerInfo });
  }

openForAll = () => {
  let state = this.state
  state.signerInfo = [];
  state.anyError='';
  state.open.bool=true;
  state.open.msg = 'Anyone can sign the document';
  state.authSignBtn.click = false;
  state.authSignBtn.text = "Only Authorised Signers"
  this.setState({ state });
}

userConsent = () => {
  if(this.state.signerInfo[0] && this.state.signerInfo[0].address && !this.state.open.bool) {
    if (window.confirm('Warning: All entered address will be reset')) {
      this.openForAll();
    }
  }else if(!this.state.open.bool){
      this.openForAll();
  }
}

handleSubmit = (e) => {
   e.preventDefault();
 }


render() {
    const {signerInfo, anyError} = this.state;
    const signerInfoLen = signerInfo.length > 0 ? true : false;
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
        <button id="add-new-btn" onClick={this.addAddress} disabled={anyError}>{this.state.authSignBtn.text}</button>
        <button id="open-for-all" onClick={this.userConsent}> Anyone can sign</button>
      </section>

      <ExpiryDate />
      </div>
    );
  }
}
//      <SignHash hashOutput={this.props.hashOutput} signerData ={signerInfoLen > 0 ? this.state.signerInfo: null}/>

export default signerListForm;
