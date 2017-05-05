const fs = require('fs')
const path = require('path')

module.exports = fs
  .readdirSync(__dirname)
  .map(filename => path.resolve(__dirname, filename))
  .filter(filepath => {
    const { ext, name } = path.parse(filepath)
    return (
      ext === '.js' &&
      name !== 'index' && name !== 'knex' && name !== 'knexfile' &&
      name.indexOf('_test') < 0 &&
      fs.statSync(filepath).isFile()
    )
  })
  .reduce((exports, filepath) => {
    const { name } = path.parse(filepath)
    const module = require(filepath)
    exports[name] = module
    return exports
  }, {})
