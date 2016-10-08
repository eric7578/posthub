import { expect } from 'chai';

import knex from './knex.js';
import { create, findByMail, findByUserId } from './mailIdentity.js';

describe('mailIdentity', () => {

  const mail = 'somebody@mail.com';
  const password = 'password';
  let user;

  before(async () => {
    await knex.migrate.latest();
  });

  after(async () => {
    await knex.migrate.rollback();
  });

  describe('#create', () => {

    it('should create a new user', async () => {
      user = await create(mail, password);

      expect(user.userId).to.be.a('number');
      expect(user.createAt).to.be.a('number');
      expect(user.lastLoginAt).to.be.a('number');
      expect(user.mail).to.be.equal(mail);
      expect(user.password).to.be.equal(password);
    });

    it('should not create with an exist mail', async () => {
      await expect(create(mail, password)).to.be.rejected;
    });

  });

  describe('#findByMail', () => {

    it('should find user by mail', async () => {
      const foundUser = await findByMail(mail);
      expect(foundUser).to.be.deep.equal(user);
    });

    it('should return null if not found', async () => {
      const notExistMail = 'nobody@mail.com';
      const foundUser = await findByMail(notExistMail);
      expect(foundUser).to.be.null;
    });

  });

  describe('#findByUserId', () => {

    it('should find user by userId', async () => {
      const foundUser = await findByUserId(user.userId);
      expect(foundUser).to.be.deep.equal(user);
    });

    it('should return null if not found', async () => {
      const foundUser = await findByUserId(0);
      expect(foundUser).to.be.null;
    });

  })

});
