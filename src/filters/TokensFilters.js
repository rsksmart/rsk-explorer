import Vue from 'vue'
import BigNumber from 'bignumber.js'
import etherUnits from '../lib/js/EtherUnits'
// const Ether = new BigNumber(10e17)

export const tokenAmount = amount => {
  if (!amount) return
  let ret = new BigNumber(amount.toString())
  let divisor = new BigNumber(10).toPower(18)
  return ret.dividedBy(divisor)
}

export const tokenValue = Vue.filter('token-value', amount => {
  let res = tokenAmount(amount)
  if (res) return res.toString()
})

export const txValue = Vue.filter('tx-value', value => {
  value = bignumberObjtoBigNumber(value)
  if (value) return etherUnits.toEther(value, 'wei')
})

export const bignumberObjtoBigNumber = value => {
  if (!value) return
  let bn = new BigNumber(0)
  bn.c = value.c
  bn.e = value.e
  bn.s = value.s
  return bn
}
