
import { ROUTES as r, STATUS, CONTRACT_CREATED, CONTRACT_FAILED } from '../types'
import { addressFilters, linkAddress, valueFilters } from './lib/fieldsTypes'
import { setThisAddress } from './lib/eventsLib'

const key = 'internalTxId'

const internalTransactionFormatRow = (itx, parentData) => {
  const { address } = parentData || {}
  const { error, result, type, action } = itx
  const { callType } = action
  const contractAddress = (result) ? result.address : undefined
  itx.status = (error) ? STATUS.FAIL : STATUS.SUCCESS
  if (address) {
    const { from, to } = action
    itx.action.from = setThisAddress(from, { address })
    itx.action.to = setThisAddress(to, { address })
  }
  if (contractAddress) {
    itx.action.to = (itx.status === STATUS.SUCCESS) ? CONTRACT_CREATED : CONTRACT_FAILED
    itx.contractAddress = contractAddress
  }
  itx._type = (type === 'call') ? callType : type
  return itx
}

const itxCss = (value, filtered, data) => {
  const { error } = data
  return (error) ? 'error' : ''
}

const formatRow = internalTransactionFormatRow

const InternalTransactions = () => {
  return {
    link: `/${r.internalTx}`,
    listLink: `/${r.internalTransactions}`,
    key,
    formatRow,
    fields: {
      from: {
        field: 'action.from',
        trim: 'auto',
        link: (data, value) => linkAddress(value),
        filters: addressFilters
      },
      to: {
        field: 'action.to',
        css: itxCss,
        trim: 'auto',
        link: ({ contractAddress }, value) => linkAddress(contractAddress || value),
        filters: addressFilters
      },
      type: {
        field: '_type'
      },
      timestamp: null,
      value: {
        field: 'action.value',
        filters: valueFilters(true),
        trim: 'auto'
      },
      status: {
        hideTitle: true,
        field: 'error',
        filters: ['itx-icon'],
        trim: 'auto',
        css: itxCss,
        renderAs: 'field-icon',
        renderAsProps: ({ filteredValue, value }) => {
          const title = (value) ? `Error: ${value}` : null
          const css = itxCss(undefined, undefined, { error: value })
          return {
            icon: filteredValue,
            css,
            title
          }
        },
        hideIfEmpty: true
      }
    }
  }
}

const InternalTransaction = () => {
  const { from, to, timestamp, value } = InternalTransactions().fields
  value.filters = valueFilters()
  const fields = {
    from,
    to,
    type: null,
    callType: {
      field: 'action.callType',
      hideIfEmpty: true
    },
    input: {
      field: 'action.input',
      renderAs: 'BigField'
    },
    value,
    status: {
      field: 'status'
    },
    timestamp,
    date: {
      field: 'timestamp',
      format: 'date'
    },
    transaction: {
      field: 'transactionHash',
      trim: 'auto',
      type: 'transaction'
    },
    blockHash: {
      trim: 'auto'
    },
    blockNumber: {
      type: 'block'
    },
    gas: {
      field: 'action.gas',
      type: 'gas'
    },
    gasUsed: {
      field: 'result.gasUsed',
      type: 'gas',
      default: 0
    },
    output: {
      field: 'result.output',
      hideIfEmpty: true
    },
    error: {
      hideIfEmpty: true,
      trim: 0,
      renderAs: 'big-field',
      css: 'error'
    },
    init: {
      field: 'action.init',
      renderAs: 'big-field',
      hideIfEmpty: true
    },
    code: {
      field: 'result.code',
      renderAs: 'big-field',
      hideIfEmpty: true
    }
  }
  return { fields, formatRow, key }
}

export const internalTransactions = InternalTransactions()
export const internalTransaction = InternalTransaction()
