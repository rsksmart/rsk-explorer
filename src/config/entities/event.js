import { ROUTES as r, EVENTS, THIS_CONTRACT } from '../types'
import { tokenAmount } from '../../filters/TokensFilters'

const setThisContract = (val, match) => {
  return val !== match ? val : THIS_CONTRACT
}

const eventFormatRow = (event, parentData) => {
  let args = event.args
  const addressData = (parentData.address) ? parentData : event._addressData
  let tokenAddress = addressData.address
  let token = addressData.name || event.address
  const decimals = parseInt(addressData.decimals)
  event._tokenAddress = tokenAddress
  event._tokenRef = token

  if (args) {
    event._value = tokenAmount(args._value, decimals)
    let to = args._to
    let from = args._from
    if (event.event === EVENTS.approval) {
      to = args._spender
      from = args._owner
    }
    event.to = setThisContract(to, event.address)
    event.from = setThisContract(from, event.address)
    return event
  }
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
        link: (data, value) => `/${r.event}/${data.eventId}`
      },
      from: { type: 'eventAddress' },
      to: { type: 'eventAddress' },
      amount: {
        field: '_value',
        filters: ['token-value']
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
    token: {
      field: '_tokenRef',
      trim: 'auto',
      type: 'tokenName'
    },
    contract: {
      field: 'address',
      trim: 'auto',
      type: 'address'
    },
    event: null,
    from: { type: 'eventAddress' },
    to: { type: 'eventAddress' },
    amount: {
      field: '_value',
      filters: ['token-value']
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
  }
  fields.to.trim = 'auto'
  fields.from.trim = 'auto'
  event.fields = fields
  return event
}

export const events = Events()
export const event = Event()
