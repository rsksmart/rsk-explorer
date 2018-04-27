/**
 * type:{
 *    key: item key field
      fields:{
        field: null | object: {
                        field: key of data source, field name as default
                        type: field name as default
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
      miner: null,
      size: null,
      timestamp: null
    }
  }
}

const Block = () => {
  let block = Blocks()
  block.fields = Object.assign(block.fields, {
    parentHash: null,
    sha3Uncles: null,
    miner: null,
    difficulty: {
      type: 'bigNumber'
    },
    gasLimit: null,
    gasUsed: null,
    nonce: null,
    transactions: {
      renderAs: 'data-table',
      renderAsProps: {
        type: 'transactions',
        hideFields: ['block'],
        link: `/${r.transactions}/`,
        sort: null
      }
    }
  })
  block.itemTitle = true
  return block
}

const Txs = () => {
  return {
    key: 'hash',
    icon: 'transaction',
    singular: 'transaction',
    plural: 'transactions',
    link: `/${r.transactions}`,
    formatRow: transactionFormatRow,
    formatFields: transactionFormatFields,
    fields: {
      hash: {
        field: 'hash',
        type: 'hash',
        link: `/${r.transactions}/`
      },
      txi: {
        field: 'transactionIndex',
        default: 0
      },
      block: {
        field: 'blockNumber',
        type: 'block'
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
        filters: ['tx-value']
      },
      gas: {
        field: 'gas',
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
}
const Tx = () => {
  let tx = Txs()
  tx.fields = Object.assign(tx.fields, {
    block: {
      field: 'blockNumber',
      type: 'block'
    },
    input: {
      field: 'input'
    }
  })
  return tx
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
  addresses: {
    key: '_id',
    icon: 'credit-card',
    type: 'addresses',
    fields: {
      _id: {
        title: 'id'
      },
      balance: {
        filters: ['tx-value'],
        default: '0'
      }
    }
  },
  address: {
    icon: 'credit-card',
    key: 'address',
    fields: {
      address: {
        link: `/${r.addresses}/`
      },
      balance: {
        filters: ['tx-value'],
        default: '0'
      }
    }
  },
  tokens: {
    icon: 'ellipsis'
  }
}
