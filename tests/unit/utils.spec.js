import { expect } from 'chai'
import * as utils from '@/lib/js/utils'

describe(`# Utils`, function () {
  describe('# utils.plainObjectChanges()', () => {
    it(`should returns object changes`, () => {
      expect(utils.plainObjectChanges({ a: 1, b: 2, c: 3 }, { b: 4 })).to.be.deep.equal({ a: 1, b: 4, c: 3 })
    })

    it(`should returns object differences`, () => {
      expect(utils.plainObjectChanges({ a: 1, b: 2, c: 3 }, { a: 1 })).to.be.deep.equal({ b: 2, c: 3 })
    })

    it(`should returns object differences`, () => {
      expect(utils.plainObjectChanges({ a: 1 }, { a: 1 })).to.be.deep.equal({})
    })

    it(`should returns object differences`, () => {
      expect(utils.plainObjectChanges({ a: 1 }, { a: 2 })).to.be.deep.equal({ a: 2 })
    })

    it(`should returns object differences`, () => {
      expect(utils.plainObjectChanges({ a: 1 }, null)).to.be.deep.equal({ a: 1 })
    })
  })

  const clampTest = [
    [10, 0, 20, 10],
    ['10', 0, 20, 10],
    [10, 0, 5, 5],
    [0, 1, 20, 1]
  ]

  describe(`utils.clamp()`, function () {
    for (let test of clampTest) {
      let [number, min, max, expected] = test
      it(`clamp(${number},${min},${max}) should be ${expected}`, () => {
        expect(utils.clamp(number, min, max)).to.be.equal(expected)
      })
    }
  })
})
