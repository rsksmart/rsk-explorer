import Vue from 'vue'
import { BigNumber } from 'bignumber.js'
import { newBigNumber } from './BigNumberFilters'
import etherUnits from '../lib/js/EtherUnits'
// const Ether = new BigNumber(10e17)

export const tokenAmount = (value, decimals = 18) => {
  if (!value) return
  decimals = decimals || 0
  if (decimals === 0) return value
  decimals = newBigNumber(decimals)
  let ret = newBigNumber(value)
  let divisor = new BigNumber(10).exponentiatedBy(decimals.toNumber())
  return ret.dividedBy(divisor)
}

export const eventValue = (value, { decimals, symbol } = {}) => {
  symbol = symbol || ''
  decimals = parseInt(decimals)
  value = (decimals) ? tokenAmount(value, decimals) : new BigNumber(value).toString()
  value = (decimals) ? `${value} ${symbol}` : value
  return value
}

export const tokenDecimals = Vue.filter('token-decimals', (value, decimals) => {
  return tokenAmount(value, decimals)
})

export const tokenValue = Vue.filter('token-value', value => {
  return (value) ? value.toString(10) : value
})

export const txValue = Vue.filter('tx-value', value => {
  value = newBigNumber(value)
  return (value) ? etherUnits.toEther(value, 'wei') : 0
})

export const txGasPrice = Vue.filter('tx-gas-price', value => {
  value = newBigNumber(value)
  return (value) ? etherUnits.toEther(value, 'wei') : 0
})
