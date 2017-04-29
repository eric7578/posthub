import { users as usersApi } from '../../api'

export const REGIST = 'user/REGIST'
export const LOGIN = 'user/LOGIN'
export const LOGOUT = 'user/LOGOUT'
export const SET_FIELD = 'user/SET_FIELD'

export default {
  state: {
    token: ''
  },
  getters: {
    isLogin (state) {
      return !!state.token
    }
  },
  mutations: {
    [SET_FIELD] (state, payload) {
      if (payload.field) {
        state[payload.field] = payload.value
      }
    }
  },
  actions: {
    async [REGIST] ({ commit }, registData) {
      const { mail, password } = registData
      const user = await usersApi.regist(mail, password)
      commit(SET_FIELD, {
        field: 'token',
        value: user.token
      })
    },
    async [LOGIN] ({ commit }, loginData) {
      const { mail, password } = loginData
      const user = await usersApi.login(mail, password)
      commit(SET_FIELD, {
        field: 'token',
        value: user.token
      })
    }
  }
}
