import { expect } from 'chai';

import { encrypt } from '../users.js';

describe('models/users', () => {

  describe('#encrypt', () => {

    it('should be encrypted with the same result', () => {
      const original = 'password';
      const { salt, password } = encrypt(original);
      expect(encrypt(original, salt).password).to.be.equal(password);
    });

  });

});
