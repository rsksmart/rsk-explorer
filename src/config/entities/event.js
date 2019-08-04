import { ROUTES as r, THIS_CONTRACT, NOT_AVAILABLE, THIS_ADDRESS } from '../types'
import {
  formatEvent,
  getEventConfig,
  getEventAbiFields,
  EventTransferFields,
  setThisAddress
} from './lib/eventsLib'
import { TxLogItem } from './transaction'

export const setThisContract = (val, { address, type }) => {
  const txt = (type === 'contract') ? THIS_CONTRACT : THIS_ADDRESS
  return val !== address ? val : txt
}

export const eventFormatRow = (event, parentData) => {
  const addressData = (parentData.address) ? parentData : event._addressData || {}
  event = formatEvent(event, addressData)
  // event.address = setThisContract(event.address, addressData)
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
      address: {
        type: 'address'
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
    _id: {
      type: 'eventId',
      hideIfEmpty: true
    },
    eventId: {
      type: 'eventId',
      hideIfEmpty: true
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
  let config = getEventConfig(event)
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
  delete event.fields.address
  event.formatFields = eventFieldsFormatter
  return event
}

export const EventData = () => {
  let eventFields = Event().fields
  let formatRow = Event().formatRow
  let { transaction, blockNumber } = eventFields
  let txLogFields = TxLogItem().fields
  txLogFields.logIndex.link = () => { }
  txLogFields.eventId.field = '_id'
  let fields = Object.assign(txLogFields, { transaction, blockNumber })
  return { formatRow, fields }
}

export const TransferEvents = () => {
  let { from, to, value, date, created } = EventTransferFields()
  let te = {
    fields: {
      event: Events().fields.event,
      contract: {
        field: 'contract',
        type: 'tokenName'
      },
      from,
      to,
      value,
      date,
      created
    },
    formatRow: (data, parentData) => {
      let eventData = formatEvent(data)
      let event = eventData._arguments
      const { _addressData, address } = data
      if (!event) return
      event._id = eventData._id
      event.event = eventData.event
      event.address = address
      event.timestamp = eventData.timestamp
      if (_addressData) {
        event.contract = _addressData.name
        event._addressData = _addressData
        event.from = setThisAddress(event.from, parentData)
        event.to = setThisAddress(event.to, parentData)
      }
      return event
    },
    formatFields: null
  }
  return Object.assign(Event(), te)
}

export const transferEvents = TransferEvents()
export const events = Events()
export const event = Event()
export const eventData = EventData()
