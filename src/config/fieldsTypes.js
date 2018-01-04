export default {
  block: {
    icon: 'cube',
    titleIcon: true,
    hideTitle: true,
    link: '/blocks/',
    filters: ['locale']
  },
  timestamp: {
    icon: 'stopwatch',
    filters: ['m-seconds-ago', 'add-ago'],
    titleIcon: true,
    hideTitle: true
  },
  transaction: {
    icon: 'credit-card'
  },
  from: {
    link: '/accounts/'
  },
  to: {
    link: '/accounts/'
  },
  hash: {
    icon: 'hash',
    titleIcon: true,
    hideTitle: true
  }
}
