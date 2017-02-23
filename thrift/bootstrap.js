// Thrift does not generate var where required in node.js
// fork from source: https://issues.apache.org/jira/browse/THRIFT-1840
const path = require('path')
const fs = require('mz/fs')

async function generateThriftFile() {
  try {
    const thriftCompiledDir = path.resolve(__dirname, 'lib')
    await fixThriftGlobalVar(thriftCompiledDir)
    await createIndexFile(thriftCompiledDir)
  } catch (err) {
    console.error(err)
  }
}

async function fixThriftGlobalVar(dir) {
  const findExports = /^([\w]+)( = )/gm
  // const findExports = /^[^var ]([\w_]+)(?!prototype)( = )/gm
  const files = await fs.readdir(dir)

  for (let filename of files) {
    const filepath = path.resolve(dir, filename)
    try {
      const content = await fs.readFile(filepath, { encoding: 'utf8' })
      const fixedContent = content.replace(findExports, 'var $1$2')
      await fs.writeFile(filepath, fixedContent)
      console.log('Fixing file: ', filepath)
    } catch (err) {
      console.error('Error processing file: ', filepath, err)
    }
  }
}

async function createIndexFile(dir) {
  const files = await fs.readdir(dir)
  const indexPath = path.resolve(__dirname, 'index.js')

  let content = 'module.exports = {\n'
  for (var i = 0; i < files.length; i++) {
    const filename = files[i]
    const basename = path.basename(filename, '.js')
    const absPath = path.resolve(dir, filename)
    const requirePath = path.relative(__dirname, absPath)
    const comma = i === files.length - 1 ? '' : ','
    content += `  ${basename}: require('./${requirePath}')${comma}\n`
  }
  content += '}'

  await fs.writeFile(indexPath, content)
}

generateThriftFile()
