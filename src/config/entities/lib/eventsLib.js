import { tokenAmount } from '../../../filters/TokensFilters'
import BigNumber from 'bignumber.js'

export const EVENTS_TYPES = {
  TRANSFER: 'Transfer'
}

export const EVENTS = [
  {
    method: 'Transfer(address,address,uint256)',
    signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    fields: {
      from: {},
      to: {},
      value: {
        filter: (value, { decimals }) => {
          decimals = parseInt(decimals)
          value = (decimals) ? tokenAmount(value, decimals) : new BigNumber(value).toString()
          return value
        }
      }
    },
    type: EVENTS_TYPES.TRANSFER
  }
]

export const TRANSFER_EVENTS = EVENTS.filter(e => e.type === EVENTS_TYPES.TRANSFER)

export const formatEvent = (event, data) => {
  let config = getEventConfigBySignature(event.signature) || {}
  let fields = config.fields || {}
  let names = Object.keys(fields)
  let args = eventArgs(event, { names })
  let parsedArgs = Object.assign({}, args)

  for (let field in fields) {
    let value = parsedArgs[field]
    let filter = fields[field].filter
    parsedArgs[field] = (filter) ? filter(value, data) : value
  }

  if (args) event._arguments = args
  if (config) event._config = config
  event._parsedArgs = parsedArgs
  return event
}

export const eventArgs = (event, { names }) => {
  names = names || []
  if (event.abi) {
    event.args = event.args || []
    let inputs = event.abi.inputs || []
    return inputs.map(i => i.name).reduce((v, a, i) => {
      let name = names[i] || a
      v[name] = event.args[i]
      return v
    }, {})
  }
}

export const filterTransferEvents = events => events.filter(e => e.event === EVENTS_TYPES.TRANSFER)

export const getEventConfigBySignature = signature => {
  let config = EVENTS.find(e => e.signature === signature) || {}
  let fields = config.fields
  if (fields) {
    for (let f in fields) {
      fields[f].field = ['_arguments', f]
    }
  }
  return config
}
