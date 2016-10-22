import { expect } from 'chai';

import { encrypt, compare } from './cryptoPassword.js';

describe('cryptoPassword', () => {

  const plainPassword = 'password';
  let hash;

  describe('#encrypt', async () => {

    it('should be encrypted with the same result', async () => {
      hash = await encrypt(plainPassword);
      expect(hash).to.be.a('string');
      expect(hash).to.not.be.equal(plainPassword);
    });

  });

  describe('#compare', () => {

    it('should return true if with original password', async () => {
      const result = await compare(plainPassword, hash);
      expect(result).to.be.true;
    });

    it('should return false if with non-original password', async () => {
      const result = await compare('some-other-stuff', hash);
      expect(result).to.be.false;
    });

  });

});
