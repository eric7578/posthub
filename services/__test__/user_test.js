import { expect } from 'chai';

import knex from '../../models/knex.js';
import { regist, login } from '../user.js';
import { encrypt } from '../../models/users.js';

describe('services/user', () => {
  let user, encryptPassword;
  const mail = 'somebody@mail.com';
  const password = 'password';

  before(async () => {
    await knex.migrate.latest();
    user = await regist(mail, password);
    encryptPassword = encrypt(password, user.salt).password;
  });

  after(async () => {
    await knex.migrate.rollback();
  });

  describe('#regist', () => {

    it('should regist with mail/password', () => {
      expect(user.userId).to.be.a('number');
      expect(user.mail).to.be.equal(mail);
      expect(user.password).to.be.equal(encryptPassword);
    });

    it('should not regist again with the same mail', async () => {
      const mail = 'somebody@mail.com';
      const password = 'password';
      await expect(regist(mail, password)).to.be.rejectedWith('User exist');
    });

  });

  describe('#login', () => {

    it('should login with mail/password', async () => {
      const loginUser = await login(mail, password);
      expect(loginUser).to.be.deep.equal(user);
    });

    it('should rejected with non-exist mail', async () => {
      const nonExistMail = 'nonexist@mail.com';
      await expect(login(nonExistMail, password)).to.be.rejectedWith('User not found')
    });

    it('should be rejected with wrong password', async () => {
      const wrongPassword = 'wrong_password';
      await expect(login(mail, wrongPassword)).to.be.rejectedWith('Invalid password');
    });

  });

});
