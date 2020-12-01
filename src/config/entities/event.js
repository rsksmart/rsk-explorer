import { ROUTES as r, THIS_CONTRACT, NOT_AVAILABLE, THIS_ADDRESS } from '../types'
import {
  formatEvent,
  getEventConfig,
  getEventAbiFields,
  EventTransferFields,
  setThisAddress
} from './lib/eventsLib'
import { TxLogItem } from './transaction'
import { isAddress } from '../../lib/js/utils'

export const setThisContract = (val, { address, type }) => {
  const txt = (type === 'contract') ? THIS_CONTRACT : THIS_ADDRESS
  return val !== address ? val : txt
}

export const eventFormatRow = ({ data, parentData }) => {
  const addressData = (parentData.address) ? parentData : data._addressData || {}
  data = formatEvent(data, addressData)
  const contractAddress = data.address
  data._contractAddress = contractAddress
  return data
}

const eventArgumentData = ({ value, row }) => {
  const { _config, _arguments } = row
  const values = _arguments
  let fields = Object.assign({}, _config.fields)
  if ((!fields || !Object.keys(fields).length) && _arguments) {
    fields = {}
    for (const fieldName in _arguments) {
      const value = _arguments[fieldName]
      const field = { showTitle: true, field: ['_arguments', fieldName] }
      if (isAddress(value)) field.type = 'eventAddress'
      fields[fieldName] = field
    }
  }
  for (const f in fields) {
    let field = fields[f]
    delete field.renderAs
    const { type } = field
    if (type === 'eventValue') {
      field = Object.assign({}, field)
      field.type = 'eventValueRounded'
    }
    field.trim = 4
    fields[f] = field
  }
  return { data: row, fields, values }
}

export const Events = () => {
  return {
    key: 'eventId',
    icon: 'zap',
    link: `/${r.event}/`,
    formatRow: eventFormatRow,
    fields: {
      event: {
        field: 'event',
        link: (data, value) => `/${r.event}/${data.eventId}`,
        default: NOT_AVAILABLE
      },
      address: {
        type: 'address'
      },
      arguments: {
        field: '_arguments',
        css: ['raw'],
        hideIfEmpty: true,
        renderAs: 'field-list',
        renderAsProps: eventArgumentData
      },
      timestamp: null,
      blockNumber: {
        type: 'block'
      }
    }
  }
}

export const EventFields = () => {
  const event = Events()
  let fields = Object.assign({
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
  const config = getEventConfig(event)
  const cFields = config.fields ? config.fields : getEventAbiFields(event)
  const hide = !cFields
  fields.eventArguments.fields = cFields
  fields.eventArguments.hide = hide
  fields.arguments.hide = !hide
  return fields
}

export const Event = () => {
  const event = Events()
  event.fields = EventFields()
  delete event.fields.address
  event.formatFields = eventFieldsFormatter
  return event
}

export const EventData = () => {
  const eventFields = Event().fields
  const formatRow = Event().formatRow
  const { transaction, blockNumber } = eventFields
  const txLogFields = TxLogItem().fields
  txLogFields.logIndex.link = () => { }
  txLogFields.eventId.field = 'eventId'
  const fields = Object.assign(txLogFields, { transaction, blockNumber })
  return { formatRow, fields }
}

export const TransferEvents = () => {
  const { from, to, value, date, created } = EventTransferFields()
  const te = {
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
    formatRow: ({ data, parentData, context }) => {
      const { _addressData, address } = data
      const eventData = formatEvent(data, _addressData || {})
      const event = eventData._arguments
      if (!event) return
      event.eventId = eventData.eventId
      event.event = eventData.event
      event.address = address
      event.timestamp = eventData.timestamp
      if (_addressData) {
        event.contract = _addressData.name
        event._addressData = _addressData
        event.from = setThisAddress(event.from, parentData, context)
        event.to = setThisAddress(event.to, parentData, context)
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
