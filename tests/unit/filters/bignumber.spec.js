import { expect } from 'chai'
import { bignumber } from '../../../src/filters/BigNumberFilters'

const cases = [
  { v: '0x1b21a1c113bc31c6971748c', e: '524797104991938385531729036' },
  { v: '0x1b2f25a71f4496623870caa', e: '525818286819838873458642090' }
]

describe('# BigNumber', () => {
  describe('bignumber', () => {
    for (const c of cases) {
      it(`${c.v}  should be ${c.e}`, () => {
        expect(bignumber(c.v)).to.be.equal(c.e)
      })
    }
  })
})
