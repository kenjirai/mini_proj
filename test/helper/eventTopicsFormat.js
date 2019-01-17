function eventSigHash(declaredEvent) {
	if(typeof declaredEvent != 'string') {
		throw (new Error(`${declaredEvent} is not a string.`));
	}
	return (web3.utils.keccak256(declaredEvent))
}

function hexPaddingProcess(hexInput) {
	const BYTES32LEN = 62;
	const LENGTHWITHPREFIX = BYTES32LEN + 2
	var hexFormat = web3.utils.toHex(hexInput);

	if(hexFormat.length < BYTES32LEN) {
		var padLeftHex = web3.utils.padLeft(hexFormat, BYTES32LEN)
		if(padLeftHex.length != LENGTHWITHPREFIX || (padLeftHex.length / 2) != 32) {
			throw new Error(
				`After adding padding to the left side Hex length should be length of 62, Current length is ${padLeftHex.length}`
				)
		}
		return padLeftHex;
	}
	
	return hexFormat;
}

function convertToHexWithPadding(strInput){
	var isHex = web3.utils.toHex(strInput)

	if( isHex === strInput) {
		throw new Error(`${strInput} is in Hex Format. Argument type should be only string and number format`)
	}

	if(isHex.toLowerCase() === 'true') {
		console.log('inside true')
		let boolConvert = 1
		hexPaddingProcess(boolConvert);
	}

	if(isHex.toLowerCase() === 'false') {
		console.log('inside false')
		let boolConvert = 0
		hexPaddingProcess(0);
	}

	return hexPaddingProcess(strInput);
}

module.exports = {
	eventSigHash : eventSigHash,
	convertToHexWithPadding: convertToHexWithPadding,
}

