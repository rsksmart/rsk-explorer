
export const stats = {
  name: 'stats',
  fields: {
    hashrate: {
      type: 'hashrate',
      title: 'net hashrate',
      showTitle: true,
      titleIcon: false
    },
    circulatingSupply: {
      icon: 'rbtc',
      showTitle: true,
      type: 'rbtcBalance',
      title: 'BTC Locked in 2WP'
    },
    bridgeBalance: {
      icon: 'btc',
      showTitle: true,
      type: 'rbtcBalance'
    },
    activeAccounts: {
      icon: 'buffer',
      filters: ['locale']
    }
  }
}
