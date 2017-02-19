const test = require('ava')
const strings = require('./strings')

test('#toCamelCase', t => {
  const camelCase = strings.toCamelCase('camel', 'case')
  const camelCaseWithUpperCase = strings.toCamelCase('CamelCase', 'With', 'UpperCase')
  t.is(camelCase, 'camelCase')
  t.is(camelCaseWithUpperCase, 'camelCaseWithUpperCase')
})
