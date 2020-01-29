export const createPayloads = (payloads) => {
  for (let p in payloads) {
    let payload = payloads[p]
    let { fields, searchField, field, type } = payload
    payload.type = type || p
    fields = fields || {}
    fields[searchField] = 1
    fields[field] = 1
    payload.fields = fields
    payloads[p] = payload
  }
  return payloads
}

const requestPayloads = {
  block: {
    module: 'blocks',
    action: 'getBlock',
    searchField: 'hash',
    fields: { number: 1, hash: 1 },
    getName: (data) => {
      return `block ${data.hash}`
    }
  },
  transaction: {
    module: 'transactions',
    action: 'getTransaction',
    searchField: 'hash',
    getName: (data) => {
      return `transaction ${data.hash}`
    }
  },
  address: {
    type: 'address'
  },
  addressByName: {
    type: 'address',
    module: 'addresses',
    action: 'findAddresses',
    searchField: 'name',
    field: 'address',
    fields: { name: 1, address: 1 },
    getTime: (data) => {
      let { createdByTx } = data
      let { timestamp } = createdByTx || {}
      return timestamp
    },
    getName: (data) => {
      let { address, name } = data
      return `${name} ${address}`
    }
  }
}

export default createPayloads(requestPayloads)
