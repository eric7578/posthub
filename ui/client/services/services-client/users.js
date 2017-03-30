export function regist(mail, password) {
  return Promise.resolve({
    mail,
    password,
    token: 'T0l<En',
    via: 'client-api'
  })
}
