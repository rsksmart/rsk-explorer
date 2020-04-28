import Vue from 'vue'
import { isDigits } from './NumberFilters.js'
import { STATUS, STATUS_ICONS } from '../config/types'
import { toChecksumAddress, isAddress } from 'rsk-utils/dist/addresses'
import store from '../store/'

export const yesNo = Vue.filter('yes-no', (value) => {
  return (value) ? 'yes' : 'no'
})

export const msSuffix = Vue.filter('ms-suffix', (value) => {
  if (!isDigits(value)) return value
  return value + 'ms'
})

export const camelCaseTo = Vue.filter('camel-case-to', (value, to = ' ') => {
  return value.replace(/([a-z])([A-Z])/g, '$1' + to + '$2').toLowerCase()
})

export const getTxStatus = value => {
  const intValue = parseInt(value)
  if (!isNaN(intValue)) {
    if (intValue === 1) value = 'SUCCESS'
    else value = 'FAIL'
  }
  return value
}

export const getItxStatus = error => (error) ? 'FAIL' : 'SUCCESS'

export const txStatus = Vue.filter('tx-status', value => {
  value = getTxStatus(value)
  return STATUS[value] || value
})

export const txIcon = Vue.filter('tx-icon', value => STATUS_ICONS[getTxStatus(value)])

export const itxIcon = Vue.filter('itx-icon', value => STATUS_ICONS[getItxStatus(value)])

export const checksumAddress = Vue.filter('checksum-address', address => {
  const chainId = store.getters.chainId
  return (isAddress(address)) ? toChecksumAddress(address, chainId) : address
})

export const textTemplate = Vue.filter('txt-template', (txt, data) => {
  try {
    Object.entries(data).forEach(field => {
      const [key, value] = field
      txt = txt.replace(`@${key}`, value)
    })
    return txt
  } catch (err) {
    return txt
  }
})
