import { decodeField } from '../../src/lib/js/decodeField'
import { expect } from 'chai'
import { rlp } from '@rsksmart/rsk-utils'

describe('decodeField()', () => {
  it('should decode data', () => {
    const data = '0xffffffffffffffffff'
    const result = decodeField(data, ['hex', 'raw', 'decimal'])
    expect(result.rlp).to.be.deep.equal(undefined)
    expect(result.hex).to.be.deep.equal(data)
    expect(result.decimal).to.be.deep.equal('4722366482869645213695')
  })

  it('should be decoded as rlp', () => {
    const data = ['a', 'b', 'c']
    const encoded = '0x' + rlp.encode(data).toString('hex')
    const result = decodeField(encoded)
    expect(result.rlp).to.be.deep.equal(data)
  })

  it('decoded object should have only selected types', () => {
    const data = ['1', '2', 'a', 'b']
    const decoded = decodeField('0x' + rlp.encode(data).toString('hex'), ['rlp'])
    expect(decoded.rlp).to.be.deep.equal(data)
    expect(Object.keys(decoded)).to.be.deep.equal(['rlp'])
  })
})
