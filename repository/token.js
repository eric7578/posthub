exports.generate = async user => {
  return user.id.toString()
}

exports.exchange = async token => {
  return parseInt(token)
}
