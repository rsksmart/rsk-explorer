import { rlp, isHexString, toBuffer } from 'rsk-utils'
import { BigNumber } from 'bignumber.js'

export function decodeField (data, types) {
  try {
    types = types || ['raw', 'rlp', 'number', 'ascii']
    types = types.reduce((v, a) => {
      v[a] = true
      return v
    }, {})
    if (!data || !isHexString(data)) return
    let decoded = {}
    if (types.raw) decoded.raw = data
    if (types.rlp) {
      let rlpDecoded = rlpDecode(data)
      if (rlpDecoded) decoded.rlp = rlpDecoded
    }
    if (types.number) decoded.number = new BigNumber(data).toString(10)
    if (types.ascii) decoded.ascii = toBuffer(data).toString()
    return decoded
  } catch (err) {
    return data
  }
}

function rlpDecode (data) {
  const toStr = value => value.toString()
  try {
    let decoded = rlp.decode(data)
    return (Array.isArray(decoded)) ? decoded.map(d => toStr(d)) : toStr(decoded)
  } catch (err) {
    // console.log(err)
  }
}
