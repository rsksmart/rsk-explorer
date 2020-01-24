import { expect } from 'chai'
import { testSearchedValue, isValidBlockNumber } from '../../src/lib/js/validate'

describe('# Search', function () {
  describe('isValidBlockNumber()', function () {
    let blocks = [
      [-1, undefined, false],
      ['10', undefined, true],
      ['2009', 1999, false]
    ]
    for (let b of blocks) {
      let [number, lastBlock, expected] = b
      it(`[${number},${lastBlock}] should be ${expected}`, () => {
        expect(isValidBlockNumber(number, lastBlock)).to.be.deep.equal(expected)
      })
    }
  })

  describe(`testSearchedValue`, function () {
    let chainId = 31
    let lastBlock = '1000000'
    let tests = [
      ['123', { block: { number: true, hash: false } }],
      ['0x6eaecb5eb7b3a8f919008817ba47d312d20b80bfed89b63b28c78bbdc46b3e31', { transaction: true }],
      ['0x0000000000000000000000000000000001000008', { address: true }],
      ['0x66f9664F97F2b50f62d13eA064982F936DE76657', { address: true }]
    ]
    for (let test of tests) {
      let [value, expected] = test
      it(`${value} should be ${expected} `, () => {
        let result = testSearchedValue(value, { chainId, lastBlock })
        expect(result).to.deep.own.include(expected)
      })
    }
  })
})
