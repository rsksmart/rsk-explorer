import { decodeField } from '../../src/lib/js/decodeField'
import { expect } from 'chai'
import { rlp } from 'rsk-utils'

describe('decodeField()', () => {
  it(`should decode data`, () => {
    let data = '0xffffffffffffffffff'
    let result = decodeField(data, ['raw', 'ascii', 'number'])
    expect(result.rlp).to.be.deep.equal(undefined)
    expect(result.raw).to.be.deep.equal(data)
    expect(result.number).to.be.deep.equal('4722366482869645213695')
  })

  it(`should be decoded as rlp`, () => {
    let data = ['a', 'b', 'c']
    let encoded = '0x' + rlp.encode(data).toString('hex')
    let result = decodeField(encoded)
    expect(result.rlp).to.be.deep.equal(data)
  })

  it(`decoded object should have only selected types`, () => {
    let data = ['1', '2', 'a', 'b']
    let decoded = decodeField('0x' + rlp.encode(data).toString('hex'), ['rlp'])
    expect(decoded.rlp).to.be.deep.equal(data)
    expect(Object.keys(decoded)).to.be.deep.equal(['rlp'])
  })
})
