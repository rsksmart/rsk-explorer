import { expect } from 'chai'
import { locale, separateDigits } from '../../../src/filters/NumberFilters'
import BigNumber from 'bignumber.js'

describe('separateDigits', function () {
  const test = [
    ['123', ['123']],
    ['123456', ['123', '456']],
    ['1234567', ['1', '234', '567']]
  ]
  for (const [t, e] of test) {
    it(`${t} should return ${e}`, () => {
      expect(separateDigits(t)).to.be.deep.equal(e)
    })
  }
})

describe('locale', function () {
  const test = [
    [4000000, '4,000,000'],
    [9000.125, '9,000.125'],
    [0.26, '0.26'],
    ['0.26', '0.26'],
    ['4000000000000000000000009000.123456789123456789', '4,000,000,000,000,000,000,000,009,000.123456789123456789'],
    [new BigNumber(1234567890), '1,234,567,890'],
    [new BigNumber(1234567890.0009), '1,234,567,890.0009'],
    [new BigNumber('4000000000000000000000009000.123456789123456789'), '4,000,000,000,000,000,000,000,009,000.123456789123456789']
  ]
  for (const [v, e] of test) {
    it(`${v} should return ${e}`, () => {
      expect(locale(v)).to.be.equal(e)
    })
  }
})
