Web3 = require('web3');

const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "value",
				"type": "string"
			},
			{
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "emitDouble",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "emitUserAdd",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "valid",
				"type": "bool"
			}
		],
		"name": "entryBoo",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "title",
				"type": "string"
			},
			{
				"name": "firstName",
				"type": "string"
			},
			{
				"name": "LastName",
				"type": "string"
			}
		],
		"name": "entryInfo",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "entryNumber",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "inputTag",
				"type": "bytes8"
			}
		],
		"name": "entryTheTag",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "value",
				"type": "string"
			},
			{
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "fireBothEvent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "fireNum",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "value",
				"type": "string"
			}
		],
		"name": "fireString",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "value",
				"type": "string"
			}
		],
		"name": "Message",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "secNum",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "value",
				"type": "string"
			},
			{
				"indexed": true,
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "Double",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "entry",
				"type": "bytes8"
			}
		],
		"name": "Tag",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "userAdd",
				"type": "address"
			}
		],
		"name": "User",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "position",
				"type": "string"
			},
			{
				"indexed": true,
				"name": "firstName",
				"type": "string"
			},
			{
				"indexed": true,
				"name": "LastName",
				"type": "string"
			}
		],
		"name": "Info",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "valid",
				"type": "bool"
			}
		],
		"name": "EntryBool",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getNum",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "storeNum",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

const provider = new Web3.providers.HttpProvider(
  "http://127.0.0.1:8545"
);

const web3 = new Web3(provider);

var address = "0x951351bc96a0664f2081edf7908a5e0cce79ff77";

var myContract = new web3.eth.Contract(abi, address);


function cl(str, method) {
	console.log(str, method);
}

module.exports = {
	cl: cl,
	myContract, myContract,
}


