import { ROUTES as r, THIS_ADDRESS, STATUS, CONTRACT_CREATED } from '../types'
const transactionFormatFields = (fields, data, parentData) => {
  return fields
}

const setThisAddress = (val, match) => {
  return val !== match ? val : THIS_ADDRESS
}

const transactionFormatRow = (tx, parentData) => {
  let address
  let contractAddress = (tx.receipt) ? tx.receipt.contractAddress : null
  if (parentData) address = parentData.address
  if (address) {
    tx.from = setThisAddress(tx.from, address)
    tx.to = setThisAddress(tx.to, address)
  }
  if (contractAddress) tx.to = CONTRACT_CREATED
  return tx
}

const txLink = (value) => {
  return (value === THIS_ADDRESS) ? null : `/${r.address}/${value}`
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
      link: (data, value) => txLink(value)
    },
    to: {
      link: (tx, value) => {
        let contractAddress = (tx.receipt) ? tx.receipt.contractAddress : null
        return txLink(contractAddress || value)
      }
    },
    value: {
      filters: ['tx-value', { name: 'round', args: 4 }, 'rbtc']
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
  fields.to.trim = 'auto'
  fields.from.trim = 'auto'
  tx.formatRow = transactionFormatRow
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
      filters: ['tx-value', 'rbtc'],
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
      filters: ['tx-gas-price', 'rbtc'],
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
  txs.fields.to.trim = 'auto'
  txs.fields.from.trim = 'auto'
  return txs
}

export const transactionsBox = TxBox()
export const transactions = Object.assign(Txs(), { formatRow: transactionFormatRow })
export const transaction = Tx()
