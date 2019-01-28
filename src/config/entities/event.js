import { ROUTES as r, THIS_CONTRACT, NOT_AVAILABLE } from '../types'
import { formatEvent, getEventConfigBySignature, getEventAbiFields } from './lib/eventsLib'
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

export const Events = () => {
  return {
    key: '_id',
    icon: 'zap',
    link: `/${r.event}/`,
    formatRow: eventFormatRow,
    fields: {
      event: {
        field: 'event',
        link: (data, value) => `/${r.event}/${data._id}`,
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

export const EventFields = () => {
  let event = Events()
  let fields = Object.assign({
    eventId: {
      field: '_id',
      type: 'eventId'
    },
    event: {},
    eventArguments: {
      field: '_parsedArgs',
      fields: {}
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
  return fields
}

const eventFieldsFormatter = (fields, event) => {
  let config = getEventConfigBySignature(event.signature)
  let cFields = config.fields || getEventAbiFields(event)
  let hide = !cFields
  fields.eventArguments.fields = cFields
  fields.eventArguments.hide = hide
  fields.arguments.hide = !hide
  return fields
}

export const Event = () => {
  let event = Events()
  event.fields = EventFields()
  event.formatFields = eventFieldsFormatter
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
