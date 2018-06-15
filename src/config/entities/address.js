import { ROUTES as r } from '../types'

const Addresses = () => {
  return {
    icon: 'credit-card',
    key: 'address',
    link: `/${r.address}`,
    listLink: `/${r.addresses}`,
    fields: {
      address: {
        trim: 'auto'
      },
      balance: {
        filters: ['tx-value', 'round', 'sbtc'],
        default: 0
      },
      type: null
    }
  }
}
// type

const Address = () => {
  let address = Addresses()
  address.fields = Object.assign(address.fields, {
    creationDate: {
      field: 'createdByTx.timestamp',
      type: 'date',
      hideIfEmpty: true
    },
    created: {
      field: 'createdByTx.timestamp',
      type: 'timestamp',
      hideIfEmpty: true
    },
    tx: {
      field: 'createdByTx.hash',
      type: 'transaction',
      hideIfEmpty: true
    }
  })
  address.fields.balance.filters = ['tx-value', 'sbtc']
  return address
}

export const address = Address()
export const addresses = Addresses()
