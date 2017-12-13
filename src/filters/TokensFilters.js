import Vue from 'vue'
import BigNumber from 'bignumber.js'
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
