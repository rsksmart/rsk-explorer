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
    minimumGasPrice: null,
    extraData: null
  })
  block.itemTitle = true
  return block
}

const BlockBox = () => {
  let blocks = Blocks()
  blocks.fields = Object.assign(blocks.fields, {
    miner: {
      trim: 'auto',
      trimOptions: {
        trimMax: 6,
        forceTrim: true
      }
    }
  })
  return blocks
}

export const blockBox = BlockBox()
export const block = Block()
export const blocks = Blocks()
