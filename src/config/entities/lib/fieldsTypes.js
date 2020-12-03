import {
  ROUTES as r,
  CONTRACT_UNKNOWN_NAME,
  NOT_AVAILABLE,
  POOL_UNKNOWN_NAME
} from '../../types'
import { isAddress } from '../../../lib/js/utils'
import { round } from '../../../filters/NumberFilters'
import { eventValue } from '../../../filters/TokensFilters'

export const txValueFilters = decimals => {
  const filters = ['tx-value']
  if (decimals) filters.push((value, data) => round(value, decimals))
  filters.push('rbtc')
  return filters
}

export const linkAddress = address => (!isAddress(address)) ? null : `/${r.address}/${address}`
export const addressFilters = ['checksum-address']

export const eventValueField = (decimals) => {
  decimals = parseInt(decimals)
  const suffix = (value, filteredValue, { _addressData }) => _addressData.symbol
  const filters = [(value, data) => eventValue(value, data._addressData)]
  if (decimals && !isNaN(decimals)) {
    filters.push((value) => {
      return round(value, decimals)
    })
  }
  return { suffix, filters }
}

const hashrate = {
  icon: 'flame',
  titleIcon: true,
  hideTitle: true,
  filters: ['big-number', 'Hs']
}

export default {
  block: {
    icon: 'cube',
    titleIcon: true,
    hideTitle: true,
    link: `/${r.block}/`,
    filters: ['locale'],
    default: 0
  },
  blockHash: {
    link: `/${r.block}/`
  },
  bigNumber: {
    filters: ['big-number']
  },
  difficulty: {
    filters: ['big-number', 'H']
  },
  timestamp: {
    icon: 'stopwatch',
    filters: ['m-seconds-ago', 'add-ago'],
    titleIcon: true,
    hideTitle: true
  },
  transaction: {
    icon: 'transaction',
    link: `/${r.transaction}/`,
    titleIcon: true,
    hideTitle: true
  },
  internalTransaction: {
    icon: 'transaction',
    link: `/${r.internalTx}/`,
    titleIcon: true,
    hideTitle: true
  },
  miner: {
    icon: 'miner',
    titleIcon: true,
    hideTitle: true,
    link: (data, value) => linkAddress(value),
    filters: addressFilters
  },
  hash: {
    icon: 'hash',
    titleIcon: true,
    hideTitle: true,
    trim: 'auto'
  },
  gas: {
    filters: ['locale']
  },
  gasPrice: {
    filters: ['tx-gas-price', 'rbtc'],
    trim: 'auto',
    default: 0
  },
  address: {
    link: (data, value) => linkAddress(value),
    filters: addressFilters
  },
  token: {
    link: value => linkAddress,
    filters: addressFilters
  },
  date: {
    icon: 'calendar',
    filters: ['date-from-unix-ts'],
    titleIcon: true,
    hideTitle: true
  },
  tokenBalance: {
    filters: ['big-number', 'locale', 'rbtc'],
    default: 0
  },
  tokenAddress: {
    trim: 'auto',
    filters: addressFilters
  },
  tokenName: {
    default: CONTRACT_UNKNOWN_NAME,
    trim: 'auto',
    link: ({ address }, value) => linkAddress(address),
    filters: addressFilters
  },
  eventAddress: {
    link: (data, value) => linkAddress(value),
    filters: addressFilters,
    default: NOT_AVAILABLE
  },
  eventValue: eventValueField(),
  eventValueRounded: eventValueField(2),
  eventId: {
    icon: 'zap',
    titleIcon: true,
    hideTitle: true,
    link: `/${r.event}/`,
    trim: 'auto'
  },
  txDensity: {
    icon: 'server',
    titleIcon: true,
    hideTitle: true,
    filters: ['tx-density', 'txs-s']
  },
  rbtcBalance: {
    filters: ['round', 'locale', 'rbtc']
  },
  hashrate,
  blockHashrate: hashrate,
  pool: {
    default: POOL_UNKNOWN_NAME,
    trim: 'auto',
    filters: addressFilters
  }
}
