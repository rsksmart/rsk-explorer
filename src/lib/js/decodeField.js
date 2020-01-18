import { rlp, isHexString, toBuffer } from 'rsk-utils'
import { BigNumber } from 'bignumber.js'

const DECODERS = {
  rlp: (d) => rlpDecode(d),
  hex: (d) => d,
  decimal: (d) => new BigNumber(d).toString(10),
  raw: (d) => toBuffer(d).toString()
}

export function decodeField (data, types) {
  try {
    types = types || ['hex', 'rlp', 'decimal', 'raw']
    if (!data || !isHexString(data)) return
    let decoded = {}
    let selectedDecoders = Object.keys(DECODERS).filter(k => types.includes(k))
    for (let d of selectedDecoders) {
      let decodedValue = DECODERS[d](data)
      if (decodedValue) decoded[d] = decodedValue
    }
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
