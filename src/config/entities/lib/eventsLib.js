import { eventValue } from '../../../filters/TokensFilters'
import { THIS_ADDRESS } from '../../types'

export const EVENTS_TYPES = {
  TRANSFER: 'Transfer'
}

export const EventTransferFields = (include) => {
  let fields = {
    from: {
      type: 'eventAddress',
      trim: 'auto'
    },
    to: {
      type: 'eventAddress',
      trim: 'auto'
    },
    value: {
      trim: 0,
      filters: (value, data) => eventValue(value, data._addressData)
    },
    data: {
      renderAs: 'big-field'
    }
  }
  if (!include) return fields
  return include.reduce((v, a, i) => {
    v[a] = fields[a]
    return v
  }, {})
}

export const EVENTS = [
  {
    method: 'Transfer(address,address,uint256)',
    signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    fields: EventTransferFields(['from', 'to', 'value']),
    type: EVENTS_TYPES.TRANSFER
  },
  {
    'method': 'Transfer(address,address,uint256,bytes)',
    'signature': 'e19260aff97b920c7df27010903aeb9c8d2be5d310a2c67824cf3f15396e4c16',
    fields: EventTransferFields(['from', 'to', 'value', 'data']),
    type: EVENTS_TYPES.TRANSFER
  }
]

export const TRANSFER_EVENTS = EVENTS.filter(e => e.type === EVENTS_TYPES.TRANSFER)

export const TRANFER_EVENTS_SIGNATURES = TRANSFER_EVENTS.map(e => e.signature)

export const filterTransferEvents = events => events.filter(e => TRANFER_EVENTS_SIGNATURES.includes(e.signature))

export const formatEvent = (event, data) => {
  let config = getEventConfigBySignature(event.signature) || {}
  let args = eventArgs(event, config)
  if (args) event._arguments = args
  if (config) event._config = config
  return event
}

export const getEventInputs = event => {
  let inputs = (event.abi) ? event.abi.inputs : []
  return inputs || []
}

export const eventArgs = (event, { fields }) => {
  let inputs = getEventInputs(event)
  fields = fields || {}
  let names = Object.keys(fields) || []
  if (event.abi) {
    event.args = event.args || []
    return inputs.map(i => i.name).reduce((v, a, i) => {
      let name = names[i] || a
      v[name] = event.args[i]
      return v
    }, {})
  }
}

export const getEventConfigBySignature = signature => {
  let config = EVENTS.find(e => e.signature === signature) || {}
  let fields = config.fields
  if (fields) {
    for (let name in fields) {
      let field = fields[name] || {}
      field.field = ['_arguments', name]
      fields[name] = field
    }
  }
  return config
}

export const getEventAbiFields = event => {
  let inputs = getEventInputs(event)
  return inputs.reduce((v, a, i) => {
    let name = a.name
    let type = a.type
    let trim = (type === 'address') ? 'auto' : 0
    let field = ['_arguments', name]
    v[name] = { type, field, trim }
    return v
  }, {})
}

export const setThisAddress = (val, { address }) => {
  return val !== address ? val : THIS_ADDRESS
}
