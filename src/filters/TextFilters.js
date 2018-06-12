import Vue from 'vue'
import { isDigits } from './NumberFilters.js'
import { STATUS } from '../config/types'

export const nodeType = Vue.filter('node-type', (text) => {
  if (text) return text.replace(/\//g, ' ')
})

export const yesNo = Vue.filter('yes-no', (value) => {
  return (value) ? 'yes' : 'no'
})

export const hashTrim = Vue.filter('hash-trim', (value, len) => {
  len = len || 8
  return value.slice(0, len) + '...' + value.slice(-len)
})

export const txtTrim = Vue.filter('txt-trim', (value, len) => {
  len = len || 20
  if (value.length >= len) value = value.slice(0, len) + '...'
  return value
})

export const msSuffix = Vue.filter('ms-suffix', (value) => {
  if (!isDigits(value)) return value
  return value + 'ms'
})

export const camelCaseTo = Vue.filter('camel-case-to', (value, to = ' ') => {
  return value.replace(/([a-z])([A-Z])/g, '$1' + to + '$2').toLowerCase()
})

export const txStatus = Vue.filter('tx-status', (value, len) => {
  if (parseInt(value) === 1) value = STATUS.SUCCESS
  else value = STATUS.FAIL
  return value
})
