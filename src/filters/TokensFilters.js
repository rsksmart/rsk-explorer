import Vue from 'vue'
import BigNumber from 'bignumber.js'
import etherUnits from '../lib/js/EtherUnits'
// const Ether = new BigNumber(10e17)

export const tokenAmount = (amount, decimals = 18) => {
  if (!amount) return
  let ret = bignumberObjtoBigNumber(amount)
  let divisor = new BigNumber(10).toPower(decimals)
  return ret.dividedBy(divisor).toString()
}

export const tokenValue = Vue.filter('token-value', amount => {
  let res = tokenAmount(amount)
  if (res) return res.toString()
})

export const txValue = Vue.filter('tx-value', value => {
  value = bignumberObjtoBigNumber(value)
  return (value) ? etherUnits.toEther(value, 'wei') : 0
})

export const txGasPrice = Vue.filter('tx-gas-price', value => {
  value = bignumberObjtoBigNumber(value)
  return (value) ? etherUnits.toEther(value, 'wei') : 0
})

export const bignumber = Vue.filter('big-number', value => {
  if (!value) return
  return bignumberObjtoBigNumber(value).toString()
})

export const bignumberObjtoBigNumber = value => {
  if (!value) return
  let bn = new BigNumber(0)
  bn.c = value.c
  bn.e = value.e
  bn.s = value.s
  return bn
}
