import React from "react";

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
    signerInfo: [{address:'', error:''}],
    anyError:''
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
      signerInfo: [...prevState.signerInfo, {address:'', error:''}],
    }));
  }

deleteAddress = (e) => {
    let signerInfo = [...this.state.signerInfo];
    signerInfo.splice(e.target.dataset.id, 1);
    this.setState({signerInfo: signerInfo});
  }

handleSubmit = (e) => { e.preventDefault() }

render() {
    const {signerInfo, anyError} = this.state;
    return (
      <form onSubmit={this.handleSubmit} >
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
               <button data-id={idx} id={`btn-${signerId}`} className='del-btn' onClick={this.deleteAddress}>Delete</button>
              </div>
            );
          })
        }
       <button id="add-new-btn" onClick={this.addAddress} disabled={anyError}>Add New Signer</button>
      </form>
    );
  }
}

export default signerListForm;
