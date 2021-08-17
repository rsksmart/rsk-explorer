import { NOT_AVAILABLE } from '../types'

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
    minerName: {
      type: 'pool',
      title: 'miner'
    },
    minerAddress: {
      type: 'address',
      trim: '3',
      title: 'miner address'
    },
    timeStamp: {
      field: 'timestamp',
      type: 'timestamp'
    },
    hash: {
      trim: '3',
      field: 'hash',
      type: 'hash'
    },
    rskTag: {
      trim: '3',
      icon: 'rsk',
      title: 'RSK Tag'
    },
    numberOfUncles: {
      title: 'uncles',
      default: 0
    },
    rskNodeVersion: {
      title: 'node'
    },
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
    }
  }
}

export const lastBtcBlocks = {
  name: 'last-btc-blocks',
  icon: 'cube',
  fields: {
    height: {
      icon: 'btc',
      type: 'miningBtcBlock',
      title: 'height',
      showTitle: true
    },
    minerName: {
      type: 'pool',
      title: 'pool'
    },
    timeStamp: {
      field: 'timestamp',
      type: 'timestamp'
    },
    hash: {
      trim: '3'
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
      type: 'miningBtcBlock',
      title: 'Best BTC Block'
    },
    bestRskBlock: {
      type: 'miningRskBlock',
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
