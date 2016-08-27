import UserService from '../UserService';

const userService = new UserService();

describe('UserService', () => {

  describe('#regist', () => {

    it('should regist with mail/password', () => {
      const registData = {
        mail: 'somebody@mail.com',
        password: 'password',
        displayName: 'somebody'
      };

      return userService.regist(registData)
      .then(registResult => {
        registResult.username.should.be.equal(registData.displayName);
        registResult.identities.should.have.lengthOf(1);
        registResult.identities[0].mail.should.be.equal(registData.mail);
      });
    });

    it('should not regist again with the same mail',  () => {
      const registData = {
        mail: 'somebody@mail.com',
        password: 'password',
        displayName: 'somebody'
      };

      return userService.regist(registData).should.be.rejectedWith('User exist');
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
         loginResult.username.should.be.equal('somebody');
         loginResult.identities.should.have.lengthOf(1);
         loginResult.identities[0].mail.should.be.equal(loginData.mail);
       });
    });

    it('should rejected with non-exist mail', () => {
      const loginData = {
         mail: 'annoymouse@mail.com',
         password: 'password',
       };

       return userService.login(loginData).should.be.rejectedWith('User not found');
    });

    it('should be rejected with wrong password', () => {
      const loginData = {
         mail: 'somebody@mail.com',
         password: 'notcorrect',
       };

       return userService.login(loginData).should.be.rejectedWith('Invalid password');
    });

  });

});
