import { ROUTES as r } from '../types'

const eventFormatRow = (event, parentData) => {
  let args = event.args
  let tokenAddress = parentData.address
  let token = parentData.name || event.address
  event._tokenAddress = tokenAddress
  event._tokenRef = token

  if (args) {
    let to = args._to
    let from = args._from

    if (event.event === 'Aproval') {
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

export const events = {
  key: '_id',
  icon: 'zap',
  link: `/${r.token}/:address/event/`,
  formatRow: eventFormatRow,
  formatFields: eventFormatFields,
  formatLink: (data, parentData, link, key) => {
    parentData = parentData || {}
    let address = parentData.address || data.address || ''
    return link.replace(':address', address) + key
  },
  fields: {
    event: null,
    from: null,
    to: null,
    amount: {
      field: 'args._value',
      filters: ['token-value']
    },
    timestamp: null,
    blockNumber: {
      type: 'block'
    }
  }
}

export const event = {
  key: '_id',
  icon: 'zap',
  formatRow: eventFormatRow,
  formatFields: eventFormatFields,
  fields: {
    event: null,
    timestamp: null,
    token: {
      field: '_tokenRef',
      trim: 'auto',
      type: 'token',
      link: (data, value) => {
        let address = data._tokenAddress
        return `/${r.token}/${address}`
      }
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
    },
    amount: {
      field: 'args._value',
      filters: ['token-value']
    },
    block: {
      field: 'blockNumber',
      type: 'block'
    }
  }
}
