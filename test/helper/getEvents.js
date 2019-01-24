const { BN, should } = require('./setup');

function testEventData(eventData, eventName, eventTestObj) {
	eventName.should.be.equal(eventData['event'], "event name should match");
	//console.log('eventdata ->>>>>>', eventData);

	if(eventTestObj) {
		Object.entries(eventTestObj).forEach(([key, value]) => {
			let suppliedValue;
			let loggedValue;
			
			if (isBN(value)) {
				suppliedValue = String(value);
				loggedValue = eventData.returnValues[key];
				suppliedValue.should.be.bignumber.equal(loggedValue);
				return('BigNumber Test Passed');	
			}

			if (typeof value === 'number') {
				suppliedValue = String(value);
				loggedValue = eventData.returnValues[key];
			} else if( typeof value === 'boolean') {
				suppliedValue = String(value);
				loggedValue = String(eventData.returnValues[key]);
			} else {
				suppliedValue = value;
				loggedValue = eventData.returnValues[key];
			}
	 
	       	suppliedValue.should.be.equal(loggedValue);
		});
	}

	return('Test Passed');
}

async function eventExist(blockNumber, deployedContract, eventName, eventTestObj) {
	console.log(typeof blockNumber);

	if(!blockNumber || typeof blockNumber !== 'number') {
		throw new Error('blockNumber is undefined/not number type. Provide the correct blockNumber')
	}

	return (
		await deployedContract.getPastEvents(eventName, {
		    fromBlock: blockNumber,
		    toBlock: blockNumber
			}).then((data) => {
				return testEventData(data[0], eventName, eventTestObj);
				//checkData = data[0];
			})
	);
}

function isBN (object) {
  return BN.isBN(object) || object instanceof BN;
}

module.exports = {
	eventExist: eventExist
}


