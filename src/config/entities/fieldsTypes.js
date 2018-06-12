import { ROUTES as r } from '../types'
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
  from: {
    link: `/${r.address}/`
  },
  to: {
    link: `/${r.address}/`
  },
  hash: {
    icon: 'hash',
    titleIcon: true,
    hideTitle: true
  },
  gas: {
    filters: ['locale']
  },
  address: {
    link: `/${r.address}/`
  },
  token: {
    link: `/${r.token}/`
  }
}
