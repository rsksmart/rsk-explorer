import Vue from 'vue'
import { BigNumber } from 'bignumber.js'

export const bignumber = Vue.filter('big-number', value => {
  if (!value) return 0
  const bn = (value._isBigNumber === true) ? value : newBigNumber(value)
  if (bn._isBigNumber === true) return bn.toString(10)
  return value
})

export const isSerializedBigNumber = (obj) => {
  if (!obj || typeof obj !== 'object') return false
  return (obj.type && obj.type === 'BigNumber')
}

export const unserializeBigNumber = (obj) => {
  if (isSerializedBigNumber(obj)) return new BigNumber(obj.value)
  return obj
}

export const newBigNumber = value => {
  if (value || value === 0) {
    if (typeof value === 'object') {
      if (isSerializedBigNumber(value)) return unserializeBigNumber(value)
      if (typeof value === 'object' && undefined !== value.c && undefined !== value.e && undefined !== value.s) {
        const bn = new BigNumber(0)
        bn.c = value.c
        bn.e = value.e
        bn.s = value.s
        return bn
      }
    } else {
      if (typeof value === 'string' || typeof value === 'number') return new BigNumber(value)
    }
  }
  return value
}
