
import { ROUTES as r } from '../types'
import { tokenAmount } from '../../filters/TokensFilters'

const accountLink = `/${r.token}/:contract/${r.account}/:address`

const formatLink = (data, parentData, link, key) => {
  const address = data.address || ''
  const contract = data.contract || ''
  return link
    .replace(':contract', contract)
    .replace(':address', address)
}

const accountFormatRow = (data, parentData) => {
  let balance = data.balance
  const contractData = data._contractData || parentData || {}
  let decimals = contractData.decimals || 18
  data.contractName = contractData.name
  decimals = parseInt(decimals)
  if (balance && decimals) data.balanceParsed = tokenAmount(balance, decimals)
  return data
}

const accountFormatFields = (fields, data, parentData) => {
  const contract = data.address || parentData.address
  const contractData = data._contractData || parentData || {}
  fields.balance.suffix = contractData.symbol || ''
  if (fields.address && !fields.address.link) {
    fields.address.link = formatLink({ contract }, null, accountLink)
  }
  return fields
}

export const TokenAccounts = () => {
  return {
    key: 'address',
    link: accountLink,
    formatRow: accountFormatRow,
    formatFields: accountFormatFields,
    formatLink,
    itemTitle: true,
    titleField: 'name',
    fields: {
      address: {
        type: 'tokenAddress',
        trim: 'auto'
      },
      balance: {
        field: 'balanceParsed',
        filters: ['big-number']
      }
    }
  }
}

const TokenAccount = () => {
  let tokenAccount = TokenAccounts()
  tokenAccount.fields = Object.assign(TokenAccounts().fields, {
    address: {
      field: 'address',
      trim: 'auto',
      link: `/${r.address}/`
    },
    contract: {
      type: 'address',
      trim: 'auto'
    },
    token: {
      field: 'contractName',
      link: (data) => `/${r.address}/${data.contract}`,
      hideIfEmpty: true
    }
  })
  return tokenAccount
}

export const tokenAccount = TokenAccount()
export const tokenAccounts = TokenAccounts()
