import { add0x, isHexString } from '@rsksmart/rsk-utils/dist/strings'
import { isAddress } from '@rsksmart/rsk-utils/dist/addresses'

export { add0x, isHexString, isAddress }

export const getType = (obj) => {
  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase()
}

export const normalizeSearch = value => {
  value = String(value).toLowerCase()
  value = (parseInt(value).toString() === Number(value).toString()) ? value : add0x(value)
  return value
}

export const plainObjectChanges = (oldObj, newObj) => {
  oldObj = oldObj || {}
  if (!newObj) return oldObj
  const diff = Object.assign(Object.assign({}, oldObj), newObj)
  for (const p in diff) {
    const newValue = newObj[p]
    const oldValue = oldObj[p]
    if (oldValue === newValue) delete diff[p]
  }
  return diff
}

export const ObjectIdToDate = id => {
  const timestamp = String(id).substr(0, 8)
  return new Date(parseInt(timestamp, 16) * 1000)
}

export const ObjectIdSecondsElapsed = id => (Date.now() - ObjectIdToDate(id)) / 1000

export const isTxHash = str => {
  return (/^(0x)?[0-9a-f]{64}$/.test(str) || /^(0x)?[0-9A-F]{64}$/.test(str))
}

export const clamp = (number, min, max) => {
  number = parseInt(number)
  number = (number < min) ? min : number
  number = (number > max) ? max : number
  return number
}
