
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
      filters: ['locale-round']
    },
    lockingCap: {
      icon: 'btc',
      showTitle: true,
      filters: ['satoshi-to-btc', 'locale-round', 'btc'],
      title: '2WP Locking Cap'
    }
  }
}
