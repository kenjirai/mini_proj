const shouldFail = require('../shouldFail');
const EventEmitter = artifacts.require('EventEmitter');
const IndirectEventEmitter = artifacts.require('IndirectEventEmitter');
const { should } = require('../setup');
const { eventExist } = require('../getEvents');
const { assertFailure } = require('../misc');

describe('expectEvent', function () {
  beforeEach(async function () {
    this.constructionValues = {
      uint: 42,
      boolean: true,
      string: 'OpenZeppelin',
    };

    this.emitter = await EventEmitter.new(
      this.constructionValues.uint,
      this.constructionValues.boolean,
      this.constructionValues.string
    );
  });

  describe('initial eventExist Test', function () {
     beforeEach(async function() {
      this.stringBlockNumber = '1';
      this.nullBlockNumber = null
      this.errorMsg = 'blockNumber is undefined/not number type. Provide the correct blockNumber';
      this.wrongMsg = 'Out of gas';
    });
     
    it('throws an error if blockNumber type is String', async function () {
      await shouldFail.customFail(eventExist(this.stringBlockNumber, this.emitter, 'ShortUint',
         {value: this.constructionValues.uint}), this.errorMsg);
    });

    it('throws an error if blockNumber type is null', async function () {
        await shouldFail.customFail(eventExist(this.nullBlockNumber, this.emitter, 'ShortUint', 
          {value: 23}), this.errorMsg);
    });
    
    it('it rejects for wrong type of Error Message', async function () {
        await assertFailure(shouldFail.customFail(eventExist(this.nullBlockNumber, this.emitter, 'ShortUint', 
          {value: 23}), this.wrongMsg));
    });
  });

  describe('eventExist on blockchain', function () {
    beforeEach(async function() {
      this.blockNum = await web3.eth.getBlockNumber();
    });

    context('short uint value', function () {
      it('accepts emitted events with correct number', async function () {
        await eventExist(this.blockNum, this.emitter, 'ShortUint', {value: this.constructionValues.uint});
      });
    
      it('throws if an incorrect value is passed', async function () {
          await shouldFail(eventExist(this.blockNum, this.emitter, 'ShortUint', {value: 23}));
      });
    });


    context('boolean value', function () {
      it('accepts emitted events with correct value', async function () {
        await eventExist(this.blockNum, this.emitter, 'Boolean', {value:this.constructionValues.boolean });
      });

      it('throws if an incorrect value is passed', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'Boolean', {value:!this.constructionValues.boolean }));
      });
    });


    context('string value', function () {
      it('accepts emitted events with correct string', async function () {
        await eventExist(this.blockNum, this.emitter, 'String');
      });

      it('throws if an incorrect string is passed', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'String', {value: 'ClosedZeppelin' }));
      });
    
      it('throws if an unemitted event is requested', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'Unemitted Event'));
      });
    });
  });

  describe('Event Argumentless', function () {
    describe('with no arguments', function () {
      beforeEach(async function () {
         await this.emitter.emitArgumentless();
         this.blockNum = await web3.eth.getBlockNumber();
      });

      it('accepts emitted events', async function () {
        await eventExist(this.blockNum, this.emitter, 'Argumentless');
      });

      it('throws if an unemitted event is requested', async function () {
         await shouldFail(eventExist(this.blockNum, this.emitter, 'UnemittedEvent'));
      });
      
    });
  });


  describe('Event ShortUint', function () {
    context('short uint value', function () {
      beforeEach(async function () {
        this.value = 42;
        await this.emitter.emitShortUint(this.value);
        this.blockNum = await web3.eth.getBlockNumber();
      });

      it('accepts emitted events with correct JavaScript number', async function () {
        await eventExist(this.blockNum, this.emitter, 'ShortUint', { value: this.value } );
        //expectEvent.inLogs(this.logs, 'ShortUint', { value: this.value });
      });

      /*      
      it('accepts emitted events with correct BigNumber', async function () {
        await eventExist(this.blockNum, this.emitter, 'ShortUint', { value: new web3.utils.BN(this.value) } );
        //expectEvent.inLogs(this.logs, 'ShortUint', { value: new BigNumber(this.value) });
      });
      */

      it('throws if an unemitted event is requested', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'UnemittedEvent',{ value: this.value } ));
      });

      it('throws if an incorrect value is passed', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'ShortUint' , { value: 23 } ));
      });
    });
  });  


});
  
  /*




    */



