import { isAddress } from '@rsksmart/rsk-utils/dist/addresses'
import { isHexString, isTxOrBlockHash, add0x } from '@rsksmart/rsk-utils/dist/strings'

export const isValidBlockNumber = (value, lastBlock) => {
  const number = parseInt(value)
  // optional checks lastBlock
  lastBlock = lastBlock || number
  return number > -1 && number <= lastBlock
}

export const testSearchedValue = (value, { lastBlock } = {}) => {
  const number = isValidBlockNumber(value, lastBlock)
  const isHex = isHexString(value)
  const hex = isHex && add0x(value)
  const address = hex && isAddress(hex)
  const transaction = isTxOrBlockHash(hex)
  const blockHash = transaction
  const block = (number || blockHash) ? { number, hash: blockHash } : undefined
  return { block, address, transaction }
}
