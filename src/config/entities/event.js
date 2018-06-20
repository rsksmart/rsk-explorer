import { ROUTES as r, EVENTS } from '../types'
import { tokenAmount } from '../../filters/TokensFilters'

const eventFormatRow = (event, parentData) => {
  let args = event.args
  const addressData = (parentData.address) ? parentData : event._addressData
  let tokenAddress = addressData.address
  let token = addressData.name || event.address
  const decimals = addressData.decimals

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
    event.to = to
    event.from = from
    return event
  }
}

const eventFormatFields = (fields, data, parentData) => {
  let token = parentData
  if (token) {
    // fields.to.link = uri
    // fields.from.link = uri
    fields.amount.suffix = token.symbol || ''
  }
  return fields
}

export const Events = () => {
  return {
    key: '_id',
    icon: 'zap',
    link: `/${r.event}/`,
    formatRow: eventFormatRow,
    formatFields: eventFormatFields,
    fields: {
      event: null,
      from: null,
      to: null,
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
  let fields = Object.assign(event.fields, {
    created: {
      field: 'timestamp',
      type: 'date'
    },
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
    transaction: {
      field: 'transactionHash',
      trim: 'auto',
      type: 'transaction'
    },
    from: {
      trim: 'auto'
    },
    to: {
      trim: 'auto'
    }
  })
  event.fields = fields
  return event
}

export const events = Events()
export const event = Event()
