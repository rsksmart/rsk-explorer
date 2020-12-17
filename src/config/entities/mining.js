export const lastRskBlocks = {
  name: 'last-rsk-blocks',
  icon: 'cube',
  fields: {
    height: {
      icon: 'rsk',
      type: 'block',
      title: 'height',
      showTitle: true
    },
    hash: {
      trim: 'auto',
      field: 'hash',
      type: 'hash'
    },
    timeStamp: {
      field: 'timestamp',
      type: 'timestamp'
    },
    minerAddress: {
      type: 'address',
      title: 'miner address'
    },
    minerName: {
      type: 'pool',
      title: 'miner'
    },
    blockInBtc: {
      type: 'btcBlock',
      icon: 'btc',
      title: 'height',
      showTitle: true
    },
    numberOfUncles: {
      title: 'uncles',
      default: 0
    },
    rskTag: {
      type: 'hash',
      icon: 'rsk',
      title: 'RSK Tag'
    },
    rskNodeVersion: {
      title: 'node'
    }
  }
}

export const lastBtcBlocks = {
  name: 'last-btc-blocks',
  icon: 'cube',
  fields: {
    minerName: {
      type: 'pool',
      title: 'pool'
    },
    height: {
      icon: 'btc',
      type: 'btcBlock',
      title: 'height',
      showTitle: true
    },
    hash: {
      trim: 'auto',
      field: 'hash',
      type: 'hash'
    },
    timeStamp: {
      field: 'timestamp',
      type: 'timestamp'
    },
    rskTag: {
      type: 'hash',
      icon: 'rsk',
      title: 'RSK Tag'
    },
    rskHeight: {
      type: 'block',
      icon: 'block',
      title: 'RSK height',
      showTitle: true,
      default: 0
    },
    status: null
  }
}

export const miningSummary = {
  name: 'mining-summary',
  fields: {
    bestBtcBlock: {
      type: 'block',
      title: 'Best BTC Block',
      showTitle: true
    },
    bestRskBlock: {
      type: 'block',
      title: 'Best RSK Block',
      showTitle: true
    },
    btcHashrate: {
      title: 'BTC Hashrate'
    },
    rskHashrate: {
      title: 'BTC Hashrate'
    },
    rskOverBtcHashrate: {
      title: 'RSK-BTC HR'
    }
  }
}
