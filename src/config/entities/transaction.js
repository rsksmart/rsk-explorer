import { ROUTES as r, THIS_ADDRESS, STATUS, CONTRACT_CREATED, CONTRACT_FAILED } from '../types'
import { BigNumber } from 'bignumber.js'
import { txGasPrice } from '../../filters/TokensFilters'
import { txStatus } from '../../filters/TextFilters'

const transactionFormatFields = (fields, data, parentData) => {
  return fields
}

const setThisAddress = (val, match) => {
  return val !== match ? val : THIS_ADDRESS
}

const transactionFee = tx => {
  const gas = new BigNumber(tx.gas)
  const gasPrice = txGasPrice(tx.gasPrice)
  return gas.multipliedBy(gasPrice).toString()
}

const transactionFormatRow = (tx, parentData) => {
  let address
  let contractAddress = (tx.receipt) ? tx.receipt.contractAddress : null
  if (parentData) address = parentData.address
  if (address) {
    tx.from = setThisAddress(tx.from, address)
    tx.to = setThisAddress(tx.to, address)
  }
  tx.status = (tx.receipt) ? tx.receipt.status : tx.status
  if (contractAddress) {
    tx.to = (txStatus(tx.status) === STATUS.SUCCESS) ? CONTRACT_CREATED : CONTRACT_FAILED
  }
  tx._fee = transactionFee(tx)
  return tx
}

const txLink = (value) => {
  return (value === THIS_ADDRESS) ? null : `/${r.address}/${value}`
}

export const txStatusCss = (status) => {
  const css = {
    FAIL: 'error',
    SUCCESS: 'brand',
    QUEUED: 'blue',
    PENDING: 'yellow'
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
      css: (value, filtered, data) => txStatusCss(txStatus((data.receipt) ? data.receipt.status : data.status || '')),
      link: (tx, value) => {
        let contractAddress = (tx.receipt) ? tx.receipt.contractAddress : null
        return txLink(contractAddress || value)
      }
    },
    value: {
      filters: ['tx-value', { name: 'round', args: 4 }, 'rbtc']
    },
    gasUsed: {
      type: 'gas',
      field: 'receipt.gasUsed',
      default: 0
    },
    time: {
      field: 'timestamp',
      type: 'timestamp'
    },
    type: {
      field: 'txType'
    },
    status: {
      field: 'status',
      filters: ['tx-status'],
      trim: 'auto',
      css: (value, filtered, data) => txStatusCss(filtered),
      hideIfEmpty: true
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

export const Tx = () => {
  let tx = Txs()
  let fields = TxFields()
  const time = fields.time
  delete fields.gas
  delete fields.time
  delete fields.gasUsed
  fields.to.trim = 'auto'
  fields.from.trim = 'auto'
  tx.formatRow = transactionFormatRow
  tx.fields = Object.assign(fields, {
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
    fee: {
      field: '_fee',
      filters: ['big-number', 'rbtc']
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
    gasUsed: {
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

export const Transactions = () => Object.assign(Txs(), { formatRow: transactionFormatRow })

export const transactionsBox = TxBox()
export const transactions = Transactions()
export const transaction = Tx()
