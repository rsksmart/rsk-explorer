import { ROUTES as r, THIS_ADDRESS, CONTRACT_UNKNOWN_NAME } from '../types'

export default {
  block: {
    icon: 'cube',
    titleIcon: true,
    hideTitle: true,
    link: `/${r.block}/`,
    filters: ['locale'],
    default: 0
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
  miner: {
    icon: 'miner',
    titleIcon: true,
    hideTitle: true,
    link: `/${r.address}/`
  },
  txAddress: {
    link: (data, value) => {
      return (value === THIS_ADDRESS) ? null : `/${r.address}/${value}`
    },
    trim: 'auto'
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
  address: {
    trim: 'auto',
    link: `/${r.address}/`
  },
  token: {
    link: `/${r.address}/`
  },
  date: {
    icon: 'calendar',
    filters: ['date-from-unix-ts'],
    titleIcon: true,
    hideTitle: true
  },
  tokenBalance: {
    filters: ['big-number', 'sbtc']
  },
  tokenAddress: {
    trim: 'auto'
  },
  tokenName: {
    default: CONTRACT_UNKNOWN_NAME,
    link: (data, value) => {
      return `/${r.address}/${data.address}`
    }
  }
}
