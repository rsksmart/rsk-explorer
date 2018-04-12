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
  }
}
