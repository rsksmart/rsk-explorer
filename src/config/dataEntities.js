/**
 * type:{
 *    key: item key field
      fields:{
        field: null | object: {
                        field: key of data source, field name as default
                        type: field name as default
                        trim: Number
                        filters: [Array] of vue filters names
                        suffix:
                        renderTitle:{
                              icon: [boolean], render icon in title
                              title: [boolean], render title text
                        }
                        renderAs: [string] Vue commponent to render field
                        renderAsProps: [object] props to pass to component
                      }
      }
 * }
 */

import { ROUTES as r, THIS_ADDRESS } from './types'

const eventFormatRow = (event, parentData) => {
  let args = event.args
  if (args) {
    let to = args._to
    let from = args._from

    if (event.event === 'Aproval') {
      to = args._spender
      from = args._owner
    }
    event.to = to
    event.from = from
    return event
  }
}
const eventFormatFields = (fields, parentData) => {
  let token = parentData
  let uri = token.baseUri + r.addresses + '/'
  fields.to.link = uri
  fields.from.link = uri
  fields.amount.suffix = token.shortName
  return fields
}

const clearIfMatch = (val, match) => {
  return val !== match ? val : null
}

const transactionFormatFields = (fields, parentData) => {
  // fields.timestamp = parentData.timestamp
  return fields
}

const transactionFormatRow = (tx, parentData) => {
  let address
  if (parentData) address = parentData.address
  if (address) {
    tx.from = clearIfMatch(tx.from, address)
    tx.to = clearIfMatch(tx.to, address)
  }
  return tx
}

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
        type: 'block'
      },
      txs: {
        field: 'txs',
        type: 'transaction'
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
      trim: 'auto'
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
    extraData: null,
    transactions: {
      renderAs: 'data-table',
      renderAsProps: {
        type: 'transactions',
        hideFields: ['block'],
        link: `/${r.transaction}/`,
        sort: null
      }
    }
  })
  block.itemTitle = true
  return block
}
const TxFields = () => {
  return {
    hash: {
      field: 'hash',
      type: 'hash',
      link: `/${r.transaction}/`
    },
    block: {
      field: 'blockNumber',
      type: 'block'
    },
    index: {
      field: 'transactionIndex',
      default: 0
    },
    status: {
      field: 'receipt.status'
    },
    from: {
      type: 'from',
      default: THIS_ADDRESS
    },
    to: {
      type: 'to',
      default: THIS_ADDRESS
    },
    value: {
      filters: ['tx-value', { name: 'round', args: 4 }, 'sbtc']
    },
    gas: {
      type: 'gas',
      default: 0
    },
    time: {
      field: 'timestamp',
      type: 'timestamp'
    },
    type: {
      field: 'txType'
    }
  }
}
const Txs = () => {
  let fields = TxFields()
  delete (fields.index)
  return {
    key: 'hash',
    icon: 'transaction',
    singular: 'transaction',
    plural: 'transactions',
    link: `/${r.transaction}`,
    listLink: `/${r.transactions}`,
    formatRow: transactionFormatRow,
    formatFields: transactionFormatFields,
    fields
  }
}
const Tx = () => {
  let tx = Txs()
  tx.fields = Object.assign(TxFields(), {
    status: {
      field: 'receipt.status',
      filters: ['tx-status'],
      trim: 'auto',
      hideIfEmpty: true
    },
    hash: {
      trim: 'auto'
    },
    to: {
      trim: 'auto'
    },
    from: {
      trim: 'auto'
    },
    block: {
      field: 'blockNumber',
      type: 'block'
    },
    nonce: {
      field: 'nonce',
      showTitle: true
    },
    value: {
      filters: ['tx-value', 'sbtc'],
      default: 0
    },
    contractAddress: {
      field: 'receipt.contractAddress',
      type: 'address',
      trim: 'auto',
      hideIfEmpty: true
    },
    input: {
      field: 'input',
      hideIfEmpty: true,
      trim: 0,
      renderAs: 'big-field'
    }
  })
  return tx
}

const Address = () => {
  return {
    icon: 'credit-card',
    key: 'address',
    link: `/${r.address}`,
    listLink: `/${r.addresses}`,
    fields: {
      address: null,
      balance: {
        filters: ['tx-value', 'sbtc'],
        default: 0
      },
      type: null
    }
  }
}

const Addresses = () => {
  let addresses = Address()
  addresses.fields = Object.assign(addresses.fields, { type: null })
  addresses.fields.balance.filters = ['tx-value', 'round', 'sbtc']
  return addresses
}

export default {
  blocks: Blocks(),
  block: Block(),
  transactions: Txs(),
  transaction: Tx(),
  events: {
    key: '_id',
    icon: 'zap',
    fields: {
      event: null,
      from: null,
      to: null,
      amount: {
        field: 'args._value',
        filters: ['token-value']
      },
      timestamp: null,
      blockNumber: {
        type: 'block'
      }
    }
  },
  event: {
    key: '_id',
    icon: 'zap',
    formatRow: eventFormatRow,
    formatFields: eventFormatFields,
    fields: {
      event: null,
      timestamp: null,
      address: null,
      transactionHash: null,
      from: {
        default: THIS_ADDRESS
      },
      to: {
        default: THIS_ADDRESS
      },
      amount: {
        field: 'args._value',
        filters: ['token-value']
      },
      block: {
        field: 'blockNumber',
        type: 'block'
      }
    }
  },
  address: Address(),
  addresses: Addresses(),
  token: {
    icon: 'ellipsis',
    key: 'address',
    link: `/${r.tokens}/`,
    itemTitle: true,
    titleField: 'name',
    fields: {
      name: null,
      shortName: null,
      address: null,
      Events: {
        default: 0
      }
    }
  },
  tokens: {
    icon: 'ellipsis'
  }
}
