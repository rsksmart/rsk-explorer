import { eventValue } from '../../../filters/TokensFilters'
import { THIS_ADDRESS } from '../../types'
import { isRemascEvent, remascEventConfig } from './remascEvents'

export const EVENTS_TYPES = {
  TRANSFER: 'Transfer'
}

export const EventTransferFields = (include) => {
  const fields = {
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
    },
    created: {
      field: 'timestamp',
      type: 'timestamp'
    },
    date: {
      field: 'timestamp',
      format: 'date'
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
    method: 'Transfer(address,address,uint256,bytes)',
    signature: 'e19260aff97b920c7df27010903aeb9c8d2be5d310a2c67824cf3f15396e4c16',
    fields: EventTransferFields(['from', 'to', 'value', 'data']),
    type: EVENTS_TYPES.TRANSFER
  }
]

export const TRANSFER_EVENTS = EVENTS.filter(e => e.type === EVENTS_TYPES.TRANSFER)

export const TRANFER_EVENTS_SIGNATURES = TRANSFER_EVENTS.map(e => e.signature)

export const filterTransferEvents = events => events.filter(e => TRANFER_EVENTS_SIGNATURES.includes(e.signature))

export const formatEvent = (event, data) => {
  const config = getEventConfig(event)
  const args = eventArgs(event, config)
  if (args) event._arguments = args
  if (config) event._config = config
  return event
}

export const getEventConfig = (event) => {
  if (isRemascEvent(event)) return remascEventConfig()
  return getEventConfigBySignature(event.signature) || {}
}

export const getEventInputs = event => {
  const inputs = (event.abi) ? event.abi.inputs : []
  return inputs || []
}

export const eventArgs = (event, { fields }) => {
  const inputs = getEventInputs(event)
  fields = fields || {}
  const names = Object.keys(fields) || []
  if (event.abi) {
    event.args = event.args || []
    return inputs.map(i => i.name).reduce((v, a, i) => {
      const name = names[i] || a
      v[name] = event.args[i]
      return v
    }, {})
  }
}

export const getEventConfigBySignature = signature => {
  const config = EVENTS.find(e => e.signature === signature)
  if (!config) return
  const fields = config.fields
  if (fields) {
    for (const name in fields) {
      const field = fields[name] || {}
      field.field = ['_arguments', name]
      fields[name] = field
    }
  }
  return config
}

export const getEventAbiFields = event => {
  const inputs = getEventInputs(event)
  return inputs.reduce((v, a, i) => {
    const { type, name } = a
    const trim = (type === 'address') ? 'auto' : 0
    const field = ['_arguments', name]
    v[name] = { type, field, trim }
    return v
  }, {})
}

export const setThisAddress = (val, { address }) => {
  return val !== address ? val : THIS_ADDRESS
}
