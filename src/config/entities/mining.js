export const lastRskBlocks = {
  name: 'last-rsk-blocks',
  icon: 'cube',
  fields: {
    guessedMiner: {
      type: 'pool',
      title: 'Guessed Miner'
    },
    btcHash: {
      trim: 'auto',
      field: 'hash',
      type: 'hash'
    },
    btcHeight: {
      icon: 'btc',
      type: 'btcBlock',
      title: 'height'
    },
    BN: {
      icon: 'rsk',
      type: 'block',
      title: 'BN'
    },
    CPV: {
      title: 'CPV'
    },
    NU: {
      title: 'NU'
    },
    prefixHash: {
      trim: 'auto',
      field: 'hash',
      type: 'hash'
    },
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
    // blockInBtc: {
    //   type: 'btcBlock',
    //   icon: 'btc',
    //   title: 'height',
    //   showTitle: true
    // },
    numberOfUncles: {
      title: 'uncles',
      default: 0
    },
    rskTag: {
      type: 'hash',
      field: 'hash',
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
      type: 'btcBlock',
      title: 'Best BTC Block'
    },
    bestRskBlock: {
      type: 'block',
      title: 'Best RSK Block'
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
