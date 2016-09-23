const resolver = {
  hello() {
    return 'world！';
  },
  createUser({ parameters }) {
    console.log(parameters)
    return {
      userId: 100,
      ...parameters,
      createAt: new Date(),
      lastLoginAt: new Date(),
    };
  },
  user() {
    return {
      name: 'ericyan',
      mail: 'eric7578@gmail.com'
    };
  },
  getUserById({ id }) {
    console.log(id)
    return {
      uid: id,
      name: 'ericyan',
      mail: 'eric7578@gmail.com',
      supervisor: {
        uid: id + 1,
        name: 'abc',
        mail: 'abc@mail.com'
      }
    };
  }
};

export default resolver;
