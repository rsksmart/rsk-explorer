import {
  ROUTES as r,
  CONTRACT_UNKNOWN_NAME,
  THIS_CONTRACT,
  NOT_AVAILABLE
} from '../../types'

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
    filters: ['big-number', 'rbtc'],
    default: 0
  },
  tokenAddress: {
    trim: 'auto'
  },
  tokenName: {
    default: CONTRACT_UNKNOWN_NAME,
    link: (data, value) => {
      return `/${r.address}/${data.address}`
    }
  },
  eventAddress: {
    link: (data, value) => (!value || value === THIS_CONTRACT) ? null : `/${r.address}/${value}`,
    default: NOT_AVAILABLE
  },
  eventId: {
    icon: 'zap',
    titleIcon: true,
    hideTitle: true,
    link: `/${r.event}/`,
    trim: 'auto'
  }
}
