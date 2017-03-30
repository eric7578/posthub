import { users } from '../services'
import store from '../store'

export function requireLogin(redirectTo = '/') {
  return async function (to, from, next) {
    const isLogin = await users.checkToken()
    if (isLogin) {
      next()
    } else {
      next({
        path: redirectTo,
        query: {
          redirect: to.fullPuath
        }
      })
    }
  }
}
