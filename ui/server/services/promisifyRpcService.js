module.exports = service => Object
  .entries(service)
  .filter(([methodName, method]) => typeof method === 'function')
  .reduce((instance, [methodName, method]) => {
    instance[methodName] = request => new Promise((resolve, reject) => {
      service[methodName].call(service, request, function (err, result) {
        if (err) reject(err)
        else resolve(result)
      })
    })

    return instance
  }, {})
