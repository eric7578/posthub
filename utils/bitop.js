exports.set = function (number, ...xs) {
  return xs.reduce((prev, x) => prev | (1 << x), number)
}

exports.clear = function (number, ...xs) {
  return xs.reduce((prev, x) => prev & (~(1 << x)), number)
}

exports.toggle = function (number, ...xs) {
  return xs.reduce((prev, x) => prev ^ (1 << x), number)
}

exports.isset = function (number, ...xs) {
  return xs.every(x => !!((number >> x) & 1))
}
