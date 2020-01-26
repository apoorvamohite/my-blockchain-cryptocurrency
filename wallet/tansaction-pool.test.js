const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

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

    describe('setTransaction', ()=>{
        it('adds a transaction to the transaction map', ()=>{
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

    describe('existingTransaction', () => {
        it('returns a transaction from the transaction map', ()=>{
            transactionPool.setTransaction(transaction);
            expect(transactionPool.existingTransaction({inputAddress: transaction.input.address})).toBe(transaction);
        });
    });
});