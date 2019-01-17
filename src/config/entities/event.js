import { ROUTES as r, THIS_CONTRACT, NOT_AVAILABLE, AUTO_FIELD } from '../types'
import { formatEvent } from './lib/eventsLib'
import { TxLogItem } from './transaction'

export const setThisContract = (val, match) => {
  return val !== match ? val : THIS_CONTRACT
}

export const eventFormatRow = (event, parentData) => {
  const addressData = (parentData.address) ? parentData : event._addressData || {}
  event = formatEvent(event, addressData)
  let contractAddress = event.address
  event._contractAddress = contractAddress
  return event
}

const eventFormatFields = (fields, data, parentData) => {
  fields = removeAutoFields(fields)
  let token = data._addressData || parentData || {}
  let value = fields.value
  if (value) value.suffix = token.symbol || ''
  let inputs = (data.abi) ? data.abi.inputs : []
  for (let input of inputs) {
    let name = input.name
    let type = input.type || null
    let field = ['_arguments', name]
    if (!fields[name]) {
      fields[name] = setAutoField({ field, type, trim: 'auto' })
    }
  }
  return fields
}

export const removeAutoFields = fields => {
  for (let f in fields) {
    let field = fields[f]
    if (field[AUTO_FIELD]) delete fields[f]
  }
  return fields
}

export const setAutoField = field => {
  field[AUTO_FIELD] = true
  return field
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
      arguments: {
        field: '_arguments',
        css: ['raw'],
        hideIfEmpty: true
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
  let fields = Object.assign({
    eventId: {
      type: 'eventId'
    },
    event: {},
    from: {
      field: '_parsedArgs.from',
      type: 'eventAddress',
      hideIfEmpty: true
    },
    to: {
      field: '_parsedArgs.to',
      type: 'eventAddress',
      hideIfEmpty: true
    },
    value: {
      field: '_parsedArgs.value',
      filters: ['token-value'],
      default: NOT_AVAILABLE,
      hideIfEmpty: true
    },
    contract: {},
    contractName: {}
  }, event.fields)
  fields = Object.assign(fields, {
    contract: {
      field: 'address',
      trim: 'auto',
      type: 'address'
    },
    contractName: {
      field: '_addressData.name',
      trim: 'auto',
      type: 'tokenName',
      hideIfEmpty: true
    },
    event: {
      default: NOT_AVAILABLE
    },
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
  })
  fields.from.trim = 'auto'
  fields.to.trim = 'auto'
  delete fields.arguments
  event.fields = fields

  return event
}

export const EventData = () => {
  let eventFields = Event().fields
  let formatRow = Event().formatRow
  let { transaction, blockNumber } = eventFields
  let txLogFields = TxLogItem().fields
  txLogFields.logIndex.link = () => { }
  let fields = Object.assign(txLogFields, { transaction, blockNumber })
  return { formatRow, fields }
}

export const events = Events()
export const event = Event()
export const eventData = EventData()
