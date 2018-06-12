
import { ROUTES as r } from '../types'

export const tokenAccounts = {
  key: 'address',
  link: `/${r.token}/:contract/${r.account}/:address`,
  formatLink: (data, parentData, link, key) => {
    const address = data.address || ''
    const contract = data.contract || ''
    return link
      .replace(':contract', contract)
      .replace(':address', address)
  },
  itemTitle: true,
  titleField: 'name',
  fields: {
    address: null,
    balance: null
  }
}

export const tokenAccount = {
  fields: {
    address: null,
    balance: null,
    contract: null
  }
}
