export const REGIST = 'user/regist'
export const LOGIN = 'user/login'
export const LOGOUT = 'user/logout'

export default services => ({
  state: {
    displayName: '',
    mail: '',
    token: ''
  },
  actions: {
    async [REGIST](context, registData) {
      const user = await services.users.regist(registData.mail, registData.password)
      context.commit(REGIST, user)
    },
    async [LOGIN](context, loginData) {
      const user = await services.users.regist(loginData.mail, loginData.password)
      context.commit(LOGIN, user)
    }
  },
  mutations: {
    [REGIST](state, user) {
      Object.assign(state, user)
    },
    [LOGIN](state, user) {
      Object.assign(state, user)
    }
  }
})
