import { NOT_AVAILABLE } from '../types'

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
      trim: '3',
      field: 'hash',
      type: 'hash'
    },
    timeStamp: {
      field: 'timestamp',
      type: 'timestamp'
    },
    minerAddress: {
      type: 'address',
      trim: '3',
      title: 'miner address'
    },
    minerName: {
      type: 'pool',
      title: 'miner'
    },
    numberOfUncles: {
      title: 'uncles',
      default: 0
    },
    rskTag: {
      trim: '3',
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
      type: 'miningBtcBlock',
      title: 'height',
      showTitle: true
    },
    hash: {
      trim: '3'
    },
    timeStamp: {
      field: 'timestamp',
      type: 'timestamp'
    },
    rskTag: {
      trim: '3',
      icon: 'rsk',
      title: 'RSK Tag',
      default: NOT_AVAILABLE
    },
    rskHeight: {
      type: 'miningRskBlock',
      icon: 'rsk',
      title: 'height',
      showTitle: true
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
