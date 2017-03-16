module.exports = function composeRpcService(service) {
  return Object
    .entries(service)
    .reduce((ret, [methodName, method]) => {
      if (typeof method === 'function') {
        ret[methodName] = decorateServiceMethod(service, method)
      }
      return ret
    }, {})
}

function decorateServiceMethod(service, method) {
  return async function(call, callback) {
    try {
      const result = await method.call(service, call.request)
      callback(null, result)
    } catch (err) {
      callback(err)
    }
  }
}
