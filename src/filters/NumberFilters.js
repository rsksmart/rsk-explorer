import Vue from 'vue'
import * as d3format from 'd3-format'
import { bignumber } from './BigNumberFilters'
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

export const separateDigits = (value, digits = 3) => {
  if (typeof value !== 'string') throw new Error('Value must be a string')
  const parts = []
  while (value.length > digits) {
    const pos = value.length - digits
    const sub = value.substr(pos, value.length)
    parts.unshift(sub)
    value = value.substr(0, pos)
  }
  parts.unshift(value)
  return parts
}

export const locale = Vue.filter('locale', (value) => {
  value = bignumber(`${value}`)
  const parts = value.split('.')
  if (parts.length > 2) throw new Error(`Invalid number ${value}`)
  value = parts.shift()
  value = separateDigits(value)
  parts.unshift(value.join(','))
  value = parts.join('.')
  return value
})

export const localeRound = Vue.filter('locale-round', (value) => {
  return d3.format(',d')(value)
})

// Format with suffix
export const Hs = Vue.filter('Hs', (value) => {
  return numerals(value) + 'Hs'
})

export const H = Vue.filter('H', (value, fixed) => {
  return numerals(value, fixed) + 'H'
})

export const gas = Vue.filter('gas', (value) => {
  return localeRound(value) + ' gas'
})

export const wei = Vue.filter('wei', (value) => {
  return localeRound(value) + ' wei'
})

export const gwei = Vue.filter('gwei', (value) => {
  return value + ' Gwei'
})

export const rbtc = Vue.filter('rbtc', (value) => {
  return value + ' RBTC'
})

export const btc = Vue.filter('btc', (value) => {
  return value + ' BTC'
})

export const round = Vue.filter('round', (value, decimals) => {
  decimals = decimals || 2
  return (value) ? d3.format(`.${decimals}f`)(value) : 0
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
