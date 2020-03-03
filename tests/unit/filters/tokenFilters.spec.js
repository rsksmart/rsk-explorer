import { expect } from 'chai'
import { tokenDecimals } from '../../../src/filters/TokensFilters'

const tests = [
  [0, 0, '0'],
  [0, '0x0', '0'],
  ['0xfff', '0x0', '4095'],
  ['0xfff', '0x2', '40.95'],
  ['0xfff', '0x2', '40.95'],
  ['0x1b21a1c113bc31c6971748c', '0x12', '524797104.991938385531729036'],
  ['1000', '0x00', '1000'],
  ['1000', 0, '1000']
]

describe(`Token decimals`, function () {
  for (let [value, decimals, result] of tests) {
    it(`${value}/${decimals} should be ${result}`, () => {
      expect(tokenDecimals(value, decimals).toString(10)).to.be.equal(result)
    })
  }
})
