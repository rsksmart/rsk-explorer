
import { ROUTES as r } from '../types'
import { tokenAmount } from '../../filters/TokensFilters'

const accountFormatRow = (data, parentData) => {
  let balance = data.balance
  let decimals = data.decimals
  if (balance) data.balanceParsed = tokenAmount(balance, decimals)
  return data
}

export const TokenAccounts = () => {
  return {
    key: 'address',
    link: `/${r.token}/:contract/${r.account}/:address`,
    formatRow: accountFormatRow,
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
      balance: {
        field: 'balanceParsed',
        filters: ['big-number']
      }
    }
  }
}

const TokenAccount = () => {
  return {
    fields: Object.assign(TokenAccounts().fields, {
      contract: null
    })
  }
}

console.log(TokenAccount())

export const tokenAccount = TokenAccount()
export const tokenAccounts = TokenAccounts()
