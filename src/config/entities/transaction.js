
import {
  ROUTES as r,
  STATUS,
  CONTRACT_CREATED,
  CONTRACT_FAILED
} from '../types'
import { BigNumber } from 'bignumber.js'
import { txGasPrice } from '../../filters/TokensFilters'
import { txIcon, txStatus } from '../../filters/TextFilters'
import { formatEvent, filterTransferEvents, setThisAddress } from './lib/eventsLib'
import { isAddress } from '../../lib/js/utils'
import { linkAddress, addressFilters, valueFilters, isExport } from './lib/fieldsTypes'

const TX_STATUS_CSS = Object.freeze({
  FAIL: 'error',
  SUCCESS: 'brand',
  QUEUED: 'blue',
  PENDING: 'yellow'
})

const TX_STATUS_MESSAGES = Object.freeze({
  QUEUED: 'The transaction nonce is not in sequence. Waiting for transaction(s) with previous nonces to be received.',
  PENDING: 'The transaction is ready to be processed and included in a block.'
})

const transactionFormatFields = (fields, data, parentData) => {
  return fields
}

const transactionFee = tx => {
  const { receipt } = tx
  if (receipt) {
    const gas = new BigNumber(receipt.gasUsed)
    const gasPrice = txGasPrice(tx.gasPrice)
    const fee = gas.multipliedBy(gasPrice).toString()
    return fee
  }
}

const transactionFormatRow = ({ data, parentData, context }) => {
  let address
  const contractAddress = (data.receipt) ? data.receipt.contractAddress : null
  if (parentData) address = parentData.address
  if (address) {
    data.from = setThisAddress(data.from, { address }, context)
    data.to = setThisAddress(data.to, { address }, context)
  }
  data.status = (data.receipt) ? data.receipt.status : data.status
  if (contractAddress) {
    data.to = (txStatus(data.status) === STATUS.SUCCESS) ? CONTRACT_CREATED : CONTRACT_FAILED
  }
  data._fee = transactionFee(data)
  return data
}

export const txStatusKey = status => Object.keys(STATUS).map(k => k).find(k => STATUS[k] === status)

export const txStatusCss = status => TX_STATUS_CSS[txStatusKey(status)] || ''

export const txStatusMessage = status => TX_STATUS_MESSAGES[txStatusKey(status)] || ''

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
      link: (data, value) => linkAddress(value),
      filters: addressFilters
    },
    to: {
      css: (value, filtered, data) => {
        if (!isAddress(value)) return
        return txStatusCss(txStatus((data.receipt) ? data.receipt.status : data.status || ''))
      },
      link: (tx, value) => {
        const contractAddress = (tx.receipt) ? tx.receipt.contractAddress : null
        return linkAddress(contractAddress || value)
      },
      filters: addressFilters
    },
    value: {
      filters: valueFilters()
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
      hideIfEmpty: true,
      valueDescription: (value, filtered, data) => txStatusMessage(filtered)
    }
  }
}
const Txs = () => {
  const fields = TxFields()
  delete (fields.index)
  fields.status = Object.assign(fields.status, {
    filters: [(value, data, context) => {
      if (isExport(context)) return txStatus(value)
      return txIcon(value)
    }],
    renderAs: 'field-icon',
    renderAsProps: ({ filteredValue, value }) => {
      if (!filteredValue) return // skips DataField custom component
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
  fields.value.filters = valueFilters(true)
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
  const tx = Txs()
  const fields = TxFields()
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
      type: 'gasPrice'
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
  const txs = Txs()
  txs.fields.to.trim = 'auto'
  txs.fields.from.trim = 'auto'
  txs.fields.hash.trim = 8
  return txs
}

export const TxLogFormatter = tx => {
  let logs = (tx.receipt) ? tx.receipt.logs : null
  const addresses = tx._addresses
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
    formatRow: ({ data, parentData }) => TxLogFormatter(data),
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
            const { logIndex, address, event } = data
            const _contractName = data._addressData.name
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

export const TxTransferEvents = () => {
  const te = TxLogs()
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

export const Transactions = () => Object.assign(Txs(), { itemEntity: 'transaction', formatRow: transactionFormatRow })

export const transactionsBox = TxBox()
export const transactions = Transactions()
export const transaction = Tx()
export const transactionLogs = TxLogs()
export const transactionLogItem = TxLogItem()
export const txTransferEvents = TxTransferEvents()
