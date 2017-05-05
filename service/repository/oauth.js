const uuid = require('uuid')

exports.getAccessToken = async function () {
  console.log('getAccessToken', arguments)
}

exports.getClient = function (clientId, clientSecret) {
  console.log('getClient', arguments)
  const authCode = uuid().toString('utf8')
  return Promise.resolve({
    authorization_code: [authCode]
  })
}

exports.generateAccessToken = async function () {
  console.log('generateAccessToken', arguments)
}

exports.generateAuthorizationCode = function generateAuthorizationCode () {
  const authCode = uuid().toString('utf8')
  console.log('generateAuthorizationCode', authCode, arguments)
  return Promise.resolve({
    grants: authCode
  })
}

exports.generateRefreshToken = async function () {
  console.log('generateRefreshToken', arguments)
}

exports.revokeAuthorizationCode = async function () {
  console.log('revokeAuthorizationCode', arguments)
}

exports.saveAuthorizationCode = async function () {
  console.log('saveAuthorizationCode', arguments)
}

exports.validateScope = async function () {
  console.log('validateScope', arguments)
}

exports.getUserFromClient = function () {
  console.log('getUserFromClient', arguments)
}

exports.saveToken = function () {
  console.log('saveToken', arguments)
}
