
import {
  ROUTES as r,
  THIS_ADDRESS,
  STATUS,
  CONTRACT_CREATED,
  CONTRACT_FAILED
} from '../types'
import { BigNumber } from 'bignumber.js'
import { txGasPrice } from '../../filters/TokensFilters'
import { txStatus } from '../../filters/TextFilters'
import { round } from '../../filters/NumberFilters'
import { formatEvent, filterTransferEvents } from './lib/eventsLib'

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

export const txStatusCss = status => {
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
      link: `/${r.transaction}/`,
      css: (value, filtered, data) => txStatusCss(txStatus(data.status))
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
      filters: ['tx-value',
        (value, data) => round(value, 4),
        'rbtc'
      ]
    },
    gasUsed: {
      type: 'gas',
      field: 'receipt.gasUsed',
      icon: 'block',
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
  fields.status = Object.assign(fields.status, {
    filters: ['tx-icon'],
    renderAs: 'field-icon',
    renderAsProps: ({ filteredValue, value }) => {
      return {
        icon: filteredValue,
        title: `status: ${txStatus(value)}`,
        css: txStatusCss(txStatus(value))
      }
    },
    hideTitle: true
  })
  fields.type = Object.assign(fields.type, {
    icon: 'transaction',
    type: null,
    showTitle: false
  })
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

export const TxLogFormatter = tx => {
  let logs = (tx.receipt) ? tx.receipt.logs : null
  let addresses = tx._addresses
  if (logs && addresses) {
    logs = logs.map(log => {
      log._addressData = addresses[log.address]
      return log
    })
  }
  return tx
}

export const TxLogs = () => {
  const tx = Tx()
  return {
    formatRow: (tx) => TxLogFormatter(tx),
    fields: {
      hash: tx.fields.hash,
      logs: {
        hideTitle: true,
        field: 'receipt.logs',
        renderAs: 'collapsible-list',
        renderAsProps: {
          type: 'transactionLogItem',
          emptyMsg: 'The transaction does not contain token transfer events',
          header: (data) => {
            let { logIndex, address, event } = data
            let _contractName = data._addressData.name
            return [logIndex, _contractName, address, event]
          }
        }
      }
    }
  }
}

export const TxLogItem = () => {
  return {
    name: 'tx-log-item',
    formatRow: formatEvent,
    fields: {
      logIndex: {
        default: 0
      },
      address: {
        type: 'address',
        trim: 'auto'
      },
      contractName: {
        field: '_addressData.name',
        type: 'tokenName',
        hideIfEmty: true
      },
      event: {
        field: 'abi',
        renderAs: 'event-call',
        hideIfEmpty: true,
        default: null
      },
      arguments: {
        field: '_arguments',
        css: ['raw'],
        hideIfEmpty: true
      },
      topics: {
        css: ['small', 'raw']
      },
      data: {
        field: 'data',
        renderAs: 'big-field'
      },
      eventId: {
        type: 'eventId'
      }
    }
  }
}

export const TransferEvents = () => {
  let te = TxLogs()
  te.formatRow = (tx) => {
    tx = TxLogFormatter(tx)
    let logs = (tx.receipt && tx.receipt.logs) ? tx.receipt.logs : []
    logs = filterTransferEvents(logs)
    tx._transferEvents = logs
    return tx
  }
  te.fields.logs.field = '_transferEvents'
  te.fields.logs.renderAsProps.type = 'event'

  return te
}

export const Transactions = () => Object.assign(Txs(), { formatRow: transactionFormatRow })

export const transactionsBox = TxBox()
export const transactions = Transactions()
export const transaction = Tx()
export const transactionLogs = TxLogs()
export const transactionLogItem = TxLogItem()
export const transferEvents = TransferEvents()
