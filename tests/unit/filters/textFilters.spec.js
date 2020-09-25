import { expect } from 'chai'
import * as textFilters from '../../../src/filters/TextFilters'

test('yesNo', [
  [1, 'yes'],
  [true, 'yes'],
  [0, 'no'],
  [null, 'no'],
  [undefined, 'no']
])

test('msSuffix', [
  ['AB', 'AB'],
  [2, '2ms'],
  ['10', '10ms']
])

test('camelCaseTo', [
  ['myName', 'my name'],
  ['my name', 'my name'],
  ['', ''],
  ['this isAnExample', 'this is an example']
])

test('txStatus', [
  [1, 'SUCCESSFUL'],
  ['1', 'SUCCESSFUL'],
  ['0x01', 'SUCCESSFUL'],
  [0, 'FAILED'],
  [2, 'FAILED']
])

test('fieldTitleFilter', [
  ['fooBarBaz', 'foo bar baz'],
  ['FOO bar baz', 'FOO bar baz'],
  ['foo bar BAZ', 'foo bar BAZ'],
  ['fooBarBAZ', 'foo bar baz']
])

function test (name, values) {
  describe(`# ${name}`, () => {
    for (const c of values) {
      const method = textFilters[name]
      const [value, expected] = c
      it(`${addQuotes(value)} should be ${addQuotes(expected)}`, () => {
        expect(method(value)).to.be.equal(expected)
      })
    }
  })
}

function addQuotes (value) {
  if (typeof value === 'string') {
    value = `"${value}"`
  }
  return value
}

describe('txtTemplate', function () {
  const name = 'test'
  const value = 1234
  const cases = [
    ['name: @name, value: @value', `name: ${name}, value: ${value}`],
    ['@name', `${name}`],
    ['@value', `${value}`]
  ]
  const txt = 'test @value'
  it('should return txt', () => {
    expect(textFilters.textTemplate(txt, undefined)).to.be.equal(txt)
    expect(textFilters.textTemplate(txt, null)).to.be.equal(txt)
    expect(textFilters.textTemplate(txt, [])).to.be.equal(txt)
  })
  for (const t of cases) {
    const [test, expected] = t
    it(`${test} should be ${expected}`, () => {
      expect(textFilters.textTemplate(test, { name, value })).to.be.equal(expected)
    })
  }
})
