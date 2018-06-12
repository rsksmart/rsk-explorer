import { ROUTES as r, THIS_ADDRESS } from '../types'
const transactionFormatFields = (fields, data, parentData) => {
  return fields
}

const clearIfMatch = (val, match) => {
  return val !== match ? val : null
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
    gasLimit: {
      field: 'gas',
      default: 0
    },
    gasUsedByTx: {
      field: 'receipt.gasUsed',
      default: 0
    },
    gasPrice: {
      field: 'gasPrice',
      filters: ['tx-gas-price', 'wei'],
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

export const transaction = Tx()
export const transactions = Txs()
