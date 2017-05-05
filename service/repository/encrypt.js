exports.hash = async origin => {
  return origin
}

exports.isEqual = async (origin, hash) => {
  return origin === hash
}
