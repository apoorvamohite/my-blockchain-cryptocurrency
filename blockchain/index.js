const Block = require('./block');
const {cryptoHash} = require('../util');
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
const { REWARD_INPUT, MINING_REWARD} = require('../config');

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({data}){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock);
    }

    static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        }
        for(let i=1; i<chain.length; i++){
            const {timestamp, lastHash, hash, nonce, difficulty, data} = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            if(lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, nonce, difficulty, data);
            if(hash !== validatedHash) return false;

            if(Math.abs(lastDifficulty - difficulty)>1) return false;
        }
        return true;
    }

    replaceChain(chain, validateTransactions, onSuccess){
        if(chain.length<=this.chain.length){
            console.error('Incoming chain should be longer than original chain');
            return;
        }
        if(!Blockchain.isValidChain(chain)){
            console.error('Incoming chain should be valid');
            return;
        }

        if(validateTransactions && !this.validTransactionData({chain})){
            console.error('The incoming chain has invalid transaction data');
            return;
        }

        if(onSuccess){
            onSuccess();
        }

        console.log('Replacing chain with ', chain);
        this.chain = chain;
    }

    validTransactionData({chain}){
        for(let i = 0; i<chain.length; i++){
            let rewardTransactionCount = 0;
            const transactionSet = new Set();
            const block = chain[i];
            for(let transaction of block.data){

                if(transaction.input.address === REWARD_INPUT.address){
                    rewardTransactionCount += 1;

                    if(rewardTransactionCount>1){
                        console.error('Miner rewards exceed limits');
                        return false;
                    }
    
                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD){
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                } else{
                    if(!Transaction.validTransaction(transaction)){
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({ chain: this.chain, address: transaction.input.address});
                    if(transaction.input.amount !== trueBalance){
                        console.error('Invalid input amount');
                        return false;
                    }

                    if(transactionSet.has(transaction)){
                        console.error('An identical transaction appears in the block more than once');
                        return false;
                    } else {
                        transactionSet.add(transaction);
                    }
                }
            }
        }
        return true;
    }
}

module.exports = Blockchain;