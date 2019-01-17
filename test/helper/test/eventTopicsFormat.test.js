var chai = require('chai');      
var should = chai.should();
const { eventSigHash , convertToHexWithPadding} = require('../eventTopicsFormat');
const { sigWithEvents } = require('./constants');
const { cl } = require('../debugUtils');

describe('eventTopicsFormat', function() {	

	describe('eventSigHash Test', function() {
		it('throws an error for non string arguments', function() {
			(() => eventSigHash(11)).should.throw(Error);
		});
		
		it('produces correct event signature hash', function() {
			Object.entries(sigWithEvents).forEach(([key , value]) => {
					var eventHash  = eventSigHash(key);
					eventHash.should.be.equal(value, 'incorrect Hashing');
			});
		});
	});

	describe('convertToHexWithPadding', function(){
		before(function () {
			this.outputLen = 64;
		});

		describe('Hex to Hex conversion', function() {
			it('throws an error if an input type is HEX', function() {
				(()=> convertToHexWithPadding('0xff')).should.throw(Error);
			});

		});

		context('Number to Hex Conversion', function() {
			before(function () {
				this.num = 11;
				this.result = convertToHexWithPadding(this.num);
			});

			it('outputs hex with correct length of 64', function() {
				(this.result.length).should.be.equal(this.outputLen, 'Hex length should be equal 64');
			});

			it('outputs HEX starting with 0x prefix', function() {
				var prefix = this.result.slice(0,2);
				prefix.should.be.equal('0x', 'Output HEX should start with prefix 0x');
			});

			it('encodes number correctly into HEX format', function() {
				var originalNum = web3.utils.hexToNumber(this.result)	
				originalNum.should.be.equal(this.num, 'must be orginal value');
			});
		});

		context('String to Hex Conversion', function() {
			beforeEach(function () {
				this.msg = 'Hello World!';
				this.result = convertToHexWithPadding(this.msg);
			});

			it('outputs hex with correct length of 64', function() {
				(this.result.length).should.be.equal(this.outputLen, 'Hex length should be equal 64');
			});

			it('outputs HEX starting with 0x prefix', function() {
				var prefix = this.result.slice(0,2);
				prefix.should.be.equal('0x', 'Output HEX should start with prefix 0x');
			});

			it('encodes number correctly into HEX format', function() {
				var originalStr = web3.utils.hexToString(this.result)	
				originalStr.should.be.equal('Hello World!', 'must be orginal value');
			});
		});
	

		describe('Bool to Hex Conversion', function() {

			context('Boolean True', function() {
				before(function () {
				this.boolTrueToNum= 1;
				this.result = convertToHexWithPadding(this.boolTrueToNum);	
				});

				it('outputs hex with correct length of 64', function() {
					(this.result.length).should.be.equal(this.outputLen, 'Hex length should be equal 64');
				});

				it('outputs HEX starting with 0x prefix', function() {
					var prefix = this.result.slice(0,2);
					prefix.should.be.equal('0x', 'Output HEX should start with prefix 0x');
				});

				it('encodes bool correctly into HEX format', function() {
					var originalNum = web3.utils.hexToNumber(this.result)	
					originalNum.should.be.equal(this.boolTrueToNum, 'must be orginal value');
				});
			})

			context('Boolean False', function() {
				before(function () {
				this.boolFalseToNum= 0;
				this.result = convertToHexWithPadding(this.boolFalseToNum);	
				});

				it('outputs hex with correct length of 64', function() {
					(this.result.length).should.be.equal(this.outputLen, 'Hex length should be equal 64');
				});

				it('outputs HEX starting with 0x prefix', function() {
					var prefix = this.result.slice(0,2);
					prefix.should.be.equal('0x', 'Output HEX should start with prefix 0x');
				});

				it('encodes bool correctly into HEX format', function() {
					var originalNum = web3.utils.hexToNumber(this.result)	
					originalNum.should.be.equal(this.boolFalseToNum, 'must be orginal value');
				});
			});
		});
	});
});



