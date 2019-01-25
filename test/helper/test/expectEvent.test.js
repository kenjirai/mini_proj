const shouldFail = require('../../shouldFail');
const EventEmitter = artifacts.require('EventEmitter');
const IndirectEventEmitter = artifacts.require('IndirectEventEmitter');
const { BN, should } = require('../setup');
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
      this.errorMsg = 'BigNumber type is expected instead number type received';
      this.blockNum = await web3.eth.getBlockNumber();
    });

    context('short uint value', function () {
      it('accepts emitted events with correct BN', async function () {
        await eventExist(this.blockNum, this.emitter, 'ShortUint', {value: new BN(this.constructionValues.uint)});
      });

      it('throws if correct Javascript number is passed', async function () {
          await shouldFail(
            eventExist(this.blockNum, this.emitter, 'ShortUint', {value: this.constructionValues.uint}));
      });

      it('throws if an incorrect value is passed', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'ShortUint', { value: 23 }));
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

    describe('event Argumentless', function () {
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

    describe('with single argument', function () {
    context('short uint value', function () {
      beforeEach(async function () {
        this.value = 42;
        await this.emitter.emitShortUint(this.value);
        this.blockNum = await web3.eth.getBlockNumber();
      });

      it('accepts emitted events with correct BN', async function () {
         await eventExist(this.blockNum, this.emitter, 'ShortUint', { value: new BN(this.value) } );
        });

      it('throws if a correct value is passed but of type number', async function () {
        const errorMsg = 'BigNumber type is expected instead number type received';
        await shouldFail.customFail(
          eventExist(this.blockNum, this.emitter, 'ShortUint', { value: this.value } )
          , errorMsg);
      });

      it('throws if an emitted event with correct BN and incorrect name is requested', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'ShortUint', { number: new BN(this.value) }));
        });

      it('throws if an unemitted event is requested', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'UnemittedEvent',{ value: this.value }));
      });

      it('throws if a correct JavaScript number is passed', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'ShortUint' , { value: 23 } ));
      });
    });

    context('short int value', function () {
      beforeEach(async function () {
        this.value = -42;
        await this.emitter.emitShortInt(this.value);
        this.blockNum = await web3.eth.getBlockNumber();
      });

      it('accepts emitted events with correct BN', async function () {
        await eventExist(this.blockNum, this.emitter, 'ShortInt', { value: new BN(this.value) } );
      });

      it('throws if a correct value is passed but of type number', async function () {
        const errorMsg = 'BigNumber type is expected instead number type received';
        await shouldFail.customFail(
          eventExist(this.blockNum, this.emitter, 'ShortInt', { value: this.value } )
          , errorMsg);
      });

      it('throws if an unemitted event is requested', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'UnemittedEvent', { value: new BN(this.value) } ));
      });

      it('throws if an incorrect value is passed', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'ShortInt', { value: new BN(-23) } ));
      });
    });

    context('long int value', function () {
      beforeEach(async function () {
        this.bigNumValue = new BN('-123456789012345678901234567890');
        await this.emitter.emitLongInt(this.bigNumValue);
        this.blockNum = await web3.eth.getBlockNumber();
      });

      it('accepts emitted events with correct BN', async function () {
        await eventExist(this.blockNum, this.emitter, 'LongInt', { value: this.bigNumValue } );
      });

      it('throws if a correct value is passed but of type number', async function () {
      const errorMsg = 'BigNumber type is expected instead number type received';
      await shouldFail.customFail(
        eventExist(this.blockNum, this.emitter, 'LongInt', { value: -123456789012345678901234567890  } )
        , errorMsg);
    });

      it('throws if an unemitted event is requested', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'UnemittedEvent', { value: this.bigNumValue } ));
      });

      it('throws if an incorrect value is passed', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'LongInt', { value: new BN(-2300) } ));
      });
    });

    context('long uint value', function () {
      beforeEach(async function () {
        this.bigNumValue = new BN('123456789012345678901234567890');
        await this.emitter.emitLongUint(this.bigNumValue);
        this.blockNum = await web3.eth.getBlockNumber();
      });

      it('accepts emitted events with correct BN', async function () {
        await eventExist(this.blockNum, this.emitter, 'LongUint', { value: this.bigNumValue } );
       // expectEvent.inLogs(this.logs, 'LongInt', { value: this.bigNumValue });
      });

      it('throws if a correct value is passed but of type number', async function () {
        const errorMsg = 'BigNumber type is expected instead number type received';
        await shouldFail.customFail(
          eventExist(this.blockNum, this.emitter, 'LongUint', { value: 123456789012345678901234567890  } )
          , errorMsg);
      });

      it('throws if an unemitted event is requested', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'UnemittedEvent', { value: this.bigNumValue } ));
       // should.Throw(() => expectEvent.inLogs(this.logs, 'UnemittedEvent', { value: this.bigNumValue }));
      });

      it('throws if an incorrect value is passed', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'LongUint', { value: new BN('999999999999999999999999') } ));
      });
    });

    context('address value', function () {
      beforeEach(async function () {
        this.value = '0x811412068E9Fbf25dc300a29E5E316f7122b282c';
        await this.emitter.emitAddress(this.value);
        this.blockNum = await web3.eth.getBlockNumber();
      });

      it('accepts emitted events with correct address', async function () {
        await eventExist(this.blockNum, this.emitter, 'Address', { value: this.value } );
      });

      it('throws if an unemitted event is requested',async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'UnemittedEvent', { value: this.value } ));
      });

      it('throws if an incorrect value is passed', async function () {
        await shouldFail(eventExist(this.blockNum, this.emitter, 'UnemittedEvent', { value:'0x21d04e022e0b52b5d5bcf90b7f1aabf406be002d' } ));
      });
    });

    context('bytes value', function () {
      context('with non-null value', function () {
        beforeEach(async function () {
          this.value = '0x12345678';
          await this.emitter.emitBytes(this.value);
          this.blockNum = await web3.eth.getBlockNumber();
        });

        it('accepts emitted events with correct bytes', async function () {
          await eventExist(this.blockNum, this.emitter, 'Bytes', { value: this.value } );
         // expectEvent.inLogs(this.logs, 'Bytes', { value: this.value });
        });

        it('throws if an unemitted event is requested', async function () {
          await shouldFail(eventExist(this.blockNum, this.emitter, 'UnemittedEvent', { value: this.value } ));
        });

        it('throws if an incorrect value is passed', async function () {
          await shouldFail(eventExist(this.blockNum, this.emitter, 'Bytes', { value: '0x123456' } ));
        });
      });

    context('with null value', function () {
        beforeEach(async function () {
            this.value = '0x';
            await this.emitter.emitBytes(this.value);
            this.blockNum = await web3.eth.getBlockNumber();
        });

        it('accepts emitted events with correct bytes', async function () {
        // expectEvent.inLogs(this.logs, 'Bytes', { value: null });
            await eventExist(this.blockNum, this.emitter, 'Bytes', { value: null } );
        });

        it('throws if an unemitted event is requested', async function () {
            await shouldFail(eventExist(this.blockNum, this.emitter, 'UnemittedEvent', { value: null } ));
        //should.Throw(() => expectEvent.inLogs(this.logs, 'UnemittedEvent', { value: null }));
        });

        it('throws if an incorrect value is passed', async function () {
            await shouldFail(eventExist(this.blockNum, this.emitter, 'Bytes', { value: '0x123456'} ));
        //should.Throw(() => expectEvent.inLogs(this.logs, 'Bytes', { value: '0x123456' }));
        });
        });
    });
});

  /*




    */
