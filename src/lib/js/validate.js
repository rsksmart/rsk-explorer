import { isAddress } from 'rsk-utils/dist/addresses'
import { isHexString, isTxOrBlockHash, add0x } from 'rsk-utils/dist/strings'

export const isValidBlockNumber = (value, lastBlock) => {
  let number = parseInt(value)
  // optional checks lastBlock
  lastBlock = lastBlock || number
  return number > -1 && number <= lastBlock
}

export const testSearchedValue = (value, { lastBlock } = {}) => {
  let number = isValidBlockNumber(value, lastBlock)
  let isHex = isHexString(value)
  let hex = isHex && add0x(value)
  let address = hex && isAddress(hex)
  let transaction = isTxOrBlockHash(hex)
  let blockHash = transaction
  let block = (number || blockHash) ? { number, hash: blockHash } : undefined
  return { block, address, transaction }
}
