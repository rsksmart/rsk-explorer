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
  let def = 'This Account'
  fields.to.link = uri
  fields.to.default = def
  fields.from.link = uri
  fields.from.default = def
  fields.amount.suffix = token.shortName
  return fields
}

const transactionFormatFields = (fields, parentData) => {
  // fields.timestamp = parentData.timestamp
  return fields
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
    key: 'transactions.hash',
    icon: 'transaction',
    fields: {
      hash: {
        field: 'transactions.hash',
        type: 'hash'
      },
      block: {
        field: 'transactions.blockNumber',
        type: 'block'
      },
      from: {
        field: 'transactions.from'
      },
      to: {
        field: 'transactions.to'
      },
      gas: {
        field: 'transactions.gas',
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
      from: {
        field: 'from'
      },
      to: {
        field: 'to'
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
      from: null,
      to: null,
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
    icon: 'credit-card'
  }
}
