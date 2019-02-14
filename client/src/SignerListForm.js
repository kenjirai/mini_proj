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

class SignerListForm extends React.Component {
  state = {
    signerList: [{address:'', error:''}],
    anyError:''
  }

handleChange = (e) => {
  let signerList = [...this.state.signerList];
  const targetId = e.target.dataset.id;
  const className = e.target.className;
  const error = 'error';
  const value = e.target.value;
  console.log('value', value)
  const validate = this.validateForm(value);
  console.log('validate', validate);
  signerList[targetId][error] = validate.errorMsg;
  this.setState({ anyError:validate.anyError });
  signerList[targetId][className] = value.trim();
  this.setState({ signerList });
}

validateForm(value) {
  //remove any first and last space
  const inputValue= value.trim();
  console.log(inputValue);
  const prefix = inputValue.slice(0,2);
  if( prefix !== "0x") {
    return {
      errorMsg:'address must start with 0x prefix.',
      anyError: true
    };
  } else if(hasSpace(inputValue)) {
    return {
      errorMsg:'address should not contain any space',
      anyError:true
    };
  } else if(value.length !== 42) {
    return {
      errorMsg:'address length should be 42 including 0x prefix at the front',
      anyError:true
    };
  } else if(!isAddressValid(inputValue)) {
    return {
      errorMsg:'address should be in correct hex format',
      anyError:true
    };
  } else {
    return {
      errorMsg:'',
      anyError:false
    };
  }
}

addAddress = (e) => {
    this.setState((prevState) => ({
      signerList: [...prevState.signerList, {address:'', error:''}],
    }));
  }

handleSubmit = (e) => { e.preventDefault() }

render() {
    const {signerList, anyError} = this.state;
    console.log('signerList', signerList);
    console.log('anyError', anyError);
    return (
      <form onSubmit={this.handleSubmit} >
        {
          signerList.map((val, idx)=> {
            const signerId = `signer-${idx}`;
            return (
              <div key={idx}>
                <label htmlFor={signerId}>{`signer #${idx + 1}`}</label>
                <input
                  type="text"
                  name={signerId}
                  data-id={idx}
                  id={signerId}
                  value={signerList[idx].address}
                  className="address"
                  onChange={this.handleChange}
                />
               <span style={{color: "red"}}>{signerList[idx].error}</span>
              </div>
            );
          })
        }
        <button onClick={this.addAddress} disabled={anyError}>Add New Signer</button>
      </form>
    );
  }
}

export default SignerListForm;
