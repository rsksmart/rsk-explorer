import Vue from 'vue'
import * as d3format from 'd3-format'
const d3 = Object.assign({}, d3format)

export const numerals = Vue.filter('numerals', (num, fixed) => {
  num = Number(num)
  if (!fixed) fixed = 1
  fixed++
  let value = d3.format('.' + fixed + 's')(num)
  // insert space between number and SI unit
  const number = value.match(/[+-]?\d+(?:\.\d+)?/g)[0]
  if (number) value = value.replace(number, `${number} `)
  return value
})

export const numeralsSuffix = Vue.filter('numerals-suffix', (num) => {
  const value = numerals(num)
  return value.replace(/\d/g, '').replace(/\./g, '')
})

export const percent = Vue.filter('percent', (value) => {
  return parseInt(value) + '%'
})

export const toInt = Vue.filter('to-int', (value) => {
  value = value || 0
  if (value === true) value = 1
  return parseInt(value)
})

export const locale = Vue.filter('locale', (value) => {
  const format = d3.format(',d')
  return format(value)
})

// Format with suffix
export const Hs = Vue.filter('Hs', (value) => {
  return numerals(value) + 'Hs'
})

export const H = Vue.filter('H', (value, fixed) => {
  return numerals(value, fixed) + 'H'
})

export const gas = Vue.filter('gas', (value) => {
  return locale(value) + ' gas'
})

export const wei = Vue.filter('wei', (value) => {
  return locale(value) + ' wei'
})

export const gwei = Vue.filter('gwei', (value) => {
  return value + ' Gwei'
})

export const rbtc = Vue.filter('rbtc', (value) => {
  return value + ' RBTC'
})

export const round = Vue.filter('round', (value, digits) => {
  digits = digits || 2
  return (value) ? d3.format(`.${digits}f`)(value) : 0
})

export const isDigits = Vue.filter('is-digits', (value) => {
  return /^-?\d+\.?\d*$/.test(value) // true for digits and '.'
})

export const count = Vue.filter('count', (value) => {
  return value.length || 0
})

export const getTxDensity = (value, decimals = 2) => {
  value = round(value, decimals)
  return value
}

export const txDensity = Vue.filter('tx-density', getTxDensity)

export const txsS = Vue.filter('txs-s', (value) => `${value} txs/s`)
