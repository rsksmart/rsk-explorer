import { ROUTES as r } from '../types'

const Blocks = () => {
  return {
    itemEntity: 'block',
    key: 'number',
    icon: 'cube',
    link: `/${r.block}/`,
    listLink: `/${r.blocks}/`,
    singular: 'block',
    plural: 'blocks',
    fields: {
      number: {
        type: 'block',
        default: 0
      },
      txs: {
        field: 'transactions',
        trim: 0,
        icon: 'transaction',
        titleIcon: true,
        hideTitle: true,
        filters: ['count']
      },
      hash: null,
      miner: {
        field: 'miner',
        type: 'miner'
      },
      size: null,
      timestamp: {
        default: 0
      }
    }
  }
}

const Block = () => {
  const block = Blocks()
  block.fields = Object.assign(block.fields, {
    hash: {
      trim: 'auto'
    },
    date: {
      field: 'timestamp',
      type: 'date'
    },
    parentHash: {
      trim: 'auto',
      link: `/${r.block}/`
    },

    miner: {
      trim: 'auto'
    },
    difficulty: {
      type: 'difficulty',
      description: 'Avg of double-SHA256 operations required to obtain a valid PoW'
    },
    totalDifficulty: {
      type: 'difficulty'
    },
    gasLimit: {
      type: 'gas'
    },
    gasUsed: {
      type: 'gas',
      default: 0
    },
    minimumGasPrice: {
      filters: ['m-gas-price', 'gwei'],
      default: 0,
      trim: 'forced-auto'
    },
    paidFees: {
      filters: ['tx-gas-price', 'rbtc'],
      default: 0
    },
    time: {
      field: '_metadata.time',
      suffix: 's'
    },
    txDensity: {
      field: '_metadata.txDensity'
    },
    blockHashrate: {
      field: '_metadata.blockHashrate'
    },
    extraData: {
      renderAs: 'big-field',
      renderAsProps: { options: { decode: true } }
    },
    sha3Uncles: {
      trim: 'auto'
    },
    uncleCount: {
      field: 'uncles',
      filters: [uncles => uncles.length.toString()]
    },
    uncles: {
      hideIfEmpty: true
    }
  })
  block.itemTitle = false
  return block
}

const MiningFields = () => {
  const miner = Block().fields
  return {
    miner,
    bitcoinMergedMiningHeader: { trim: 'auto' },
    bitcoinMergedMiningCoinbaseTransaction: { trim: 'auto' },
    bitcoinMergedMiningMerkleProof: { trim: 'auto' },
    hashForMergedMining: { trim: 'auto' }
  }
}

const BlockBox = () => {
  const blocks = Blocks()
  const { txDensity, blockHashrate } = Block().fields
  blocks.fields = Object.assign(blocks.fields, {
    miner: {
      trim: 4
    },
    txDensity,
    blockHashrate
  })
  return blocks
}

const BlockMining = () => {
  const block = Block()
  block.fields = MiningFields()
  return block
}

export const blockMining = BlockMining()
export const blockBox = BlockBox()
export const block = Block()
export const blocks = Blocks()
