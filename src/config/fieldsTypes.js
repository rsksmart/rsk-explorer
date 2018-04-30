import { ROUTES as r } from './types'
export default {
  block: {
    icon: 'cube',
    titleIcon: true,
    hideTitle: true,
    link: `/${r.blocks}/`,
    filters: ['locale']
  },
  bigNumber: {
    filters: ['big-number']
  },
  timestamp: {
    icon: 'stopwatch',
    filters: ['m-seconds-ago', 'add-ago'],
    titleIcon: true,
    hideTitle: true
  },
  transaction: {
    icon: 'transaction',
    titleIcon: true,
    hideTitle: true
  },
  miner: {
    icon: 'miner',
    titleIcon: true,
    hideTitle: true,
    link: `/${r.addresses}/`
  },
  from: {
    link: `/${r.addresses}/`
  },
  to: {
    link: `/${r.addresses}/`
  },
  hash: {
    icon: 'hash',
    titleIcon: true,
    hideTitle: true
  }
}
