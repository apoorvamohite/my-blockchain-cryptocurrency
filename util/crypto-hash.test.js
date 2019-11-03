const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('Hello Blockchain')).toEqual("7cf88f2ee398c0b7c0e760a1dccaf3571e0baccf310f11fe3bdfd0b09675ea75");
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    });
});