import { ROUTES as r, EVENTS, THIS_CONTRACT, NOT_AVAILABLE } from '../types'
import { tokenAmount } from '../../filters/TokensFilters'
import { TxLogItem } from './transaction'

export const setThisContract = (val, match) => {
  return val !== match ? val : THIS_CONTRACT
}

const eventFormatRow = (event, parentData) => {
  let args = event.args
  const addressData = (parentData.address) ? parentData : event._addressData
  let tokenAddress = addressData.address
  let token = addressData.name || null
  const decimals = parseInt(addressData.decimals)
  event._tokenAddress = tokenAddress
  event._tokenRef = token
  event.to = null
  event.from = null
  event._value = null

  if (args) {
    event._value = tokenAmount(args.value, decimals)
    let to = args.to
    let from = args.from
    if (event.event === EVENTS.approval) {
      to = args.spender
      from = args.owner
    }
    event.to = setThisContract(to, event.address)
    event.from = setThisContract(from, event.address)
  }
  return event
}

const eventFormatFields = (fields, data, parentData) => {
  let token = data._addressData || parentData || {}
  fields.amount.suffix = token.symbol || ''
  return fields
}

export const Events = () => {
  return {
    key: 'eventId',
    icon: 'zap',
    link: `/${r.event}/`,
    formatRow: eventFormatRow,
    formatFields: eventFormatFields,
    fields: {
      event: {
        field: 'event',
        link: (data, value) => `/${r.event}/${data.eventId}`,
        default: NOT_AVAILABLE
      },
      from: { type: 'eventAddress' },
      to: { type: 'eventAddress' },
      amount: {
        field: '_value',
        filters: ['token-value'],
        default: NOT_AVAILABLE
      },
      timestamp: null,
      blockNumber: {
        type: 'block'
      }
    }
  }
}

export const Event = () => {
  let event = Events()
  let fields = {
    contractName: {
      field: '_tokenRef',
      trim: 'auto',
      type: 'tokenName',
      hideIfEmpty: true
    },
    contract: {
      field: 'address',
      trim: 'auto',
      type: 'address'
    },
    event: {
      default: NOT_AVAILABLE
    },
    from: { type: 'eventAddress' },
    to: { type: 'eventAddress' },
    amount: event.fields.amount,
    data: {
      field: 'args._data',
      hideIfEmpty: true,
      trim: 0
    },
    timestamp: null,
    created: {
      field: 'timestamp',
      type: 'date'
    },
    transaction: {
      field: 'transactionHash',
      trim: 'auto',
      type: 'transaction'
    },
    blockNumber: {
      type: 'block'
    }
  }
  fields.to.trim = 'auto'
  fields.from.trim = 'auto'
  event.fields = fields
  return event
}

export const EventData = () => {
  let eventFields = Event().fields
  let { transaction, blockNumber } = eventFields
  let txLogFields = TxLogItem().fields
  txLogFields.logIndex.link = () => { }
  let fields = Object.assign(txLogFields, { transaction, blockNumber })
  return { fields }
}

export const events = Events()
export const event = Event()
export const eventData = EventData()
