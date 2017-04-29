const { slice } = Array.prototype

exports.toCamelCase = function () {
  const fstArg = arguments[0].charAt(0).toLowerCase() + arguments[0].slice(1)
  const otherArgs = slice.call(arguments, 1).map(arg => arg.charAt(0).toUpperCase() + arg.slice(1))
  return fstArg + otherArgs.join('')
}
