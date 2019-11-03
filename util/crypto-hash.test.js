const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('Hello Blockchain')).toEqual("9867e35e8af7e4446f5cbd032eedd5e05771e3f8f85ceafd579b4a8a1c5bc1f7");
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    });

    it('produces a different hash when the properties of the input change', () => {
        const foo = {};
        originalHash = cryptoHash(foo);
        foo['a'] = 'a';
        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});