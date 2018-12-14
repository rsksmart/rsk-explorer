import { expect } from 'chai'
import * as utils from '@/lib/js/utils'

describe('# utils.plainObjectChanges', () => {
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
