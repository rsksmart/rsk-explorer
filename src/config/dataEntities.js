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

export default {
  blocks: {
    key: 'number',
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
  block: {},
  transactions: {
    key: 'transactions.hash',
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
  transaction: {},
  events: {
    key: '_id',
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
  accounts: {
    key: '_id',
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
  account: {}
}
