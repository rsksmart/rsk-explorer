/**
 * type:{
 *    key: item key field
 *    gridComponent: Vue component name to render item in grid mode
      fields:{
        field: null | object: {
                        field: key of data source, field name as default
                        type: field name as default
                        filters: Array of vue filters names
                        suffix:
                        renderTitle:{
                              icon: boolean, render icon in title
                              title: boolean, render title text
                        }

                      }
      }
 * }
 */

const THIS_ACCOUNT = 'This Account'

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
  let uri = token.baseUri + 'accounts/'
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
  let account
  if (parentData) account = parentData.account
  if (account) {
    tx.from = clearIfMatch(tx.from, account)
    tx.to = clearIfMatch(tx.to, account)
  }
  return tx
}

export default {
  blocks: {
    key: 'number',
    icon: 'cube',
    gridComponent: 'block-box',
    fields: {
      number: {
        type: 'block'
      },
      txs: null,
      hash: null,
      miner: null,
      size: null,
      timestamp: null
    }
  },
  block: {
    icon: 'cube'
  },
  transactions: {
    key: 'hash',
    icon: 'transaction',
    link: '/transactions',
    formatRow: transactionFormatRow,
    fields: {
      hash: {
        field: 'hash',
        type: 'hash'
      },
      block: {
        field: 'blockNumber',
        type: 'block'
      },
      from: {
        type: 'from',
        default: THIS_ACCOUNT
      },
      to: {
        type: 'to',
        default: THIS_ACCOUNT
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
      }
    }
  },
  transaction: {
    key: 'hash',
    icon: 'transaction',
    formatFields: transactionFormatFields,
    fields: {
      hash: {
        type: 'hash'
      },
      block: {
        field: 'blockNumber',
        type: 'block'
      },
      transactionIndex: null,
      from: {
        field: 'from',
        default: THIS_ACCOUNT
      },
      to: {
        field: 'to',
        default: THIS_ACCOUNT
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
      }
    }
  },
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
        default: THIS_ACCOUNT
      },
      to: {
        default: THIS_ACCOUNT
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
  accounts: {
    key: '_id',
    icon: 'credit-card',
    type: 'accounts',
    fields: {
      _id: {
        title: 'id'
      },
      balance: {
        filters: ['token-value'],
        default: '0'
      }
    }
  },
  account: {
    icon: 'credit-card',
    fields: {}
  }
}
