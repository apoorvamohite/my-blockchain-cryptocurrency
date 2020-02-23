const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', ()=>{

    let transaction, transactionPool, senderWallet;

    beforeEach(()=>{
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recipient: 'some-recipient',
            amount: 200
        });
        transactionPool = new TransactionPool();
    });

    describe('setTransaction()', ()=>{
        it('adds a transaction to the transaction map', ()=>{
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

    describe('existingTransaction()', () => {
        it('returns a transaction from the transaction map', ()=>{
            transactionPool.setTransaction(transaction);
            expect(transactionPool.existingTransaction({inputAddress: transaction.input.address})).toBe(transaction);
        });
    });

    describe('validTransactions()', ()=>{
        let validTransactions, errorMock;

        beforeEach(()=>{
            validTransactions = [];
            errorMock = jest.fn();
            global.console.error = errorMock;
            
            for(let i = 0; i<10; i++){
                transaction = new Transaction({ senderWallet, recipient:'foo', amount:25});

                if(i%3===0){
                    transaction.input.amount=9999999;
                } else if(i%3===1){
                    transaction.input.signature = new Wallet().sign('foobar');
                } else{
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction);
            }
        });

        it('returns all valid transactions from the transaction map', ()=>{
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });

        it('logs error for invalid transaction', ()=>{
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        });
    });

    describe('clear()', ()=>{

        it('clears the transactions', ()=>{
            transactionPool.clear();
            expect(transactionPool.transactionMap).toEqual({});
        });
    });

    describe('clearBlockchainTransactions()', ()=>{

        it('clears the pool of any blockchain transactions', ()=>{
            const blockchain = new Blockchain();
            const expectedTransactionMap = {};

            for(let i = 0; i<6; i++){
                const transaction = new Wallet().createTransaction({
                    recipient:'foo',
                    amount:20
                });

                transactionPool.setTransaction(transaction);

                if(i%2===0){
                    blockchain.addBlock({ data: [transaction]});
                } else{
                    expectedTransactionMap[transaction.id] = transaction;
                }
            }

            transactionPool.clearBlockchainTransactions({ chain: blockchain.chain});
            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        });
    });
});