import { expect } from 'chai';

import userService from '../user';

describe('userService', () => {

  describe('#regist', () => {

    it('should regist with mail/password', () => {
      const registData = {
        mail: 'somebody@mail.com',
        password: 'password',
        displayName: 'somebody'
      };

      return userService.regist(registData)
      .then(registResult => {
        expect(registResult.username).to.be.equal(registData.displayName);
        expect(registResult.identities).to.have.lengthOf(1);
        expect(registResult.identities[0].mail).to.be.equal(registData.mail);
      });
    });

    it('should not regist again with the same mail',  () => {
      const registData = {
        mail: 'somebody@mail.com',
        password: 'password',
        displayName: 'somebody'
      };

      return expect(userService.regist(registData)).to.be.rejectedWith('User exist');
    });

  });

  describe('#login', () => {

    it('should login with mail/password', () => {
      const loginData = {
         mail: 'somebody@mail.com',
         password: 'password',
       };

       return userService.login(loginData)
       .then(loginResult => {
         expect(loginResult.username).to.be.equal('somebody');
         expect(loginResult.identities).to.have.lengthOf(1);
         expect(loginResult.identities[0].mail).to.be.equal(loginData.mail);
       });
    });

    it('should rejected with non-exist mail', () => {
      const loginData = {
         mail: 'annoymouse@mail.com',
         password: 'password',
       };

       return expect(userService.login(loginData)).to.be.rejectedWith('User not found');
    });

    it('should be rejected with wrong password', () => {
      const loginData = {
         mail: 'somebody@mail.com',
         password: 'notcorrect',
       };

       return expect(userService.login(loginData)).to.be.rejectedWith('Invalid password');
    });

  });

});
