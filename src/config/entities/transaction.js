import { ROUTES as r, THIS_ADDRESS, STATUS } from '../types'
const transactionFormatFields = (fields, data, parentData) => {
  return fields
}

const setThisAddress = (val, match) => {
  return val !== match ? val : THIS_ADDRESS
}

const transactionFormatRow = (tx, parentData) => {
  let address
  if (parentData) address = parentData.address
  if (address) {
    tx.from = setThisAddress(tx.from, address)
    tx.to = setThisAddress(tx.to, address)
  }
  return tx
}

const txStatusCss = (status) => {
  const css = {
    FAIL: 'error',
    SUCCESS: 'brand'
  }
  let key = Object.keys(STATUS).map(k => k).find(k => STATUS[k] === status)
  return css[key] || ''
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
      type: 'txAddress'
    },
    to: {
      type: 'txAddress'
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
    formatFields: transactionFormatFields,
    fields
  }
}

const Tx = () => {
  let tx = Txs()
  let fields = TxFields()
  const time = fields.time
  delete (fields.gas)
  delete (fields.time)
  tx.fields = Object.assign(fields, {
    status: {
      field: 'receipt.status',
      filters: ['tx-status'],
      trim: 'auto',
      css: (value, filtered, data) => txStatusCss(filtered),
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
      showTitle: true,
      default: 0
    },
    value: {
      filters: ['tx-value', 'sbtc'],
      default: 0
    },
    time,
    date: {
      field: 'timestamp',
      type: 'date'
    },
    gas: {
      field: 'gas',
      default: 0
    },
    gasUsedByTx: {
      field: 'receipt.gasUsed',
      type: 'gas',
      default: 0
    },
    gasPrice: {
      field: 'gasPrice',
      filters: ['tx-gas-price', 'sbtc'],
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

const TxBox = () => {
  let txs = Txs()
  txs.fields = Object.assign(txs.fields, {
    to: {
      trim: 'auto'
    },
    from: {
      trim: 'auto'
    }
  })
  return txs
}

export const transactionsBox = TxBox()
export const transactions = Object.assign(Txs(), { formatRow: transactionFormatRow })
export const transaction = Tx()
