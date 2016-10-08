import chai, { expect, spy } from 'chai';
import proxyquire from 'proxyquire';

describe('user', () => {

  const mail = 'somebody@mail.com';
  const password = 'password';

  describe('#loginMailIdentity', () => {

    let mailIdentity, cryptoPassword, serivce;

    beforeEach(() => {
      mailIdentity = {};
      cryptoPassword = {};
      serivce = proxyquire('./user.js', {
        '../models/mailIdentity.js': mailIdentity,
        '../models/cryptoPassword.js': cryptoPassword,
      });
    });

    it('should login with mail/password', async () => {
      const foundUser = { userId: 1, password: 'hash' };
      mailIdentity.findByMail = spy(() => foundUser);
      cryptoPassword.compare = spy(() => true);

      const loginUser = await serivce.loginMailIdentity(mail, password);

      expect(mailIdentity.findByMail).to.have.been.called.with.exactly(mail);
      expect(cryptoPassword.compare).to.have.been.called.with.exactly(password, foundUser.password);
      expect(loginUser).to.be.deep.equal(foundUser);
    });

    it('should rejected with non-exist mail', async () => {
      const nonExistMail = 'nobody@mail.com';
      mailIdentity.findByMail = spy(() => null);
      cryptoPassword.compare = spy();

      await expect(serivce.loginMailIdentity(nonExistMail, password)).to.be.rejectedWith('User not found');
      expect(mailIdentity.findByMail).to.have.been.called.with.exactly(nonExistMail);
      expect(cryptoPassword.compare).to.have.not.been.called();
    });

    it('should be rejected with wrong password', async () => {
      const foundUser = { userId: 1, password: 'hash' };
      mailIdentity.findByMail = spy(() => foundUser);
      cryptoPassword.compare = spy(() => false);

      await expect(serivce.loginMailIdentity(mail, password)).to.be.rejectedWith('Invalid password');
      expect(mailIdentity.findByMail).to.have.been.called.with.exactly(mail);
      expect(cryptoPassword.compare).to.have.been.called.with.exactly(password, foundUser.password);
    });

  });

  describe('#registMailIdentity', () => {

    let mailIdentity, cryptoPassword, serivce;

    beforeEach(() => {
      mailIdentity = {};
      cryptoPassword = {};
      serivce = proxyquire('./user.js', {
        '../models/mailIdentity.js': mailIdentity,
        '../models/cryptoPassword.js': cryptoPassword,
      });
    });

    it('should regist with mail/password', async () => {
      const createdUser = { userId: 1, };
      const hash = 'hash';
      mailIdentity.findByMail = spy(() => null);
      mailIdentity.create = spy(() => createdUser);
      cryptoPassword.encrypt = spy(() => hash);

      const user = await serivce.registMailIdentity(mail, password);

      expect(mailIdentity.findByMail).to.have.been.called.with.exactly(mail);
      expect(cryptoPassword.encrypt).to.have.been.called.with.exactly(password);
      expect(mailIdentity.create).to.have.been.called.with.exactly(mail, hash);
      expect(user).to.be.deep.equal(createdUser);
    });

    it('should not regist again with the same mail', async () => {
      const foundUser = { userId: 1, };
      mailIdentity.findByMail = spy(() => foundUser);
      mailIdentity.create = spy();
      cryptoPassword.encrypt = spy();

      await expect(serivce.registMailIdentity(mail, password)).to.be.rejectedWith('User exist');
      expect(mailIdentity.findByMail).to.have.been.called.with.exactly(mail);
      expect(cryptoPassword.encrypt).to.have.not.been.called();
      expect(mailIdentity.create).to.have.not.been.called();
    });

  });

});
