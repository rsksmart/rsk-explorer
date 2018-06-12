import { ROUTES as r } from '../types'

const Address = () => {
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
        filters: ['tx-value', 'sbtc'],
        default: 0
      },
      type: null
    }
  }
}

const Addresses = () => {
  let addresses = Address()
  addresses.fields = Object.assign(addresses.fields, { type: null })
  addresses.fields.balance.filters = ['tx-value', 'round', 'sbtc']
  return addresses
}

export const address = Address()
export const addresses = Addresses()
