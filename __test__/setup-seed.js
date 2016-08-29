import userService from '../services/user';

before(done => {

  userService.regist({
    mail: 'default_user@mail.com',
    password: 'password',
    displayName: 'default user'
  })
  .then(registData => {
    global.defaultUser = registData;
    done();
  });

});
