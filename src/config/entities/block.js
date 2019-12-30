import { ROUTES as r } from '../types'

const Blocks = () => {
  return {
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
  let block = Blocks()
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
    sha3Uncles: {
      trim: 'auto'
    },
    miner: {
      trim: 'auto'
    },
    difficulty: {
      type: 'difficulty'
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
    }
  })
  block.itemTitle = true
  return block
}

const BlockBox = () => {
  let blocks = Blocks()
  let { txDensity, blockHashrate } = Block().fields
  blocks.fields = Object.assign(blocks.fields, {
    miner: {
      trim: 4
    },
    txDensity,
    blockHashrate
  })
  return blocks
}

export const blockBox = BlockBox()
export const block = Block()
export const blocks = Blocks()
