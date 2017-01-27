const test = require('ava')
const bitop = require('./bitop')

test('#set', t => {
  const origin = parseInt('0000', 2)
  const modify = bitop.set(origin, 0, 1, 3)
  t.is(modify.toString(2), '1011')
})

test('#clear', t => {
  const origin = parseInt('1111', 2)
  const modify = bitop.clear(origin, 2)
  t.is(modify.toString(2), '1011')
})

test('#toggle', t => {
  const origin = parseInt('1001', 2)
  const modify = bitop.toggle(origin, 0, 1)
  t.is(modify.toString(2), '1010')
})

test('#isset', t => {
  const value = parseInt('1001', 2)
  const isSet = bitop.isset(value, 0, 3)
  const isNotSet = bitop.isset(value, 1, 2)
  t.true(isSet)
  t.false(isNotSet)
})
