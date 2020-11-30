
import { ROUTES as r, THIS_CONTRACT } from '../types'
import { applyDecimals } from '../../filters/TokensFilters'
import { setThisContract } from './event'
import { balanceFilters, balanceListFilters } from './lib/fieldsTypes'

const accountLink = `/${r.token}/:contract/${r.account}/:address`

const formatLink = (data, parentData, link, key) => {
  const address = data.address || ''
  const contract = data.contract || ''
  return link
    .replace(':contract', contract)
    .replace(':address', address)
}

const accountFormatRow = (data, parentData) => {
  const balance = data.balance
  const contractData = data._contractData || parentData || {}
  let decimals = contractData.decimals || 0
  data.contractName = contractData.name
  decimals = parseInt(decimals)
  data.balanceParsed = applyDecimals(balance, decimals)
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

export const TokenAccountsFields = () => {
  return {
    address: {
      type: 'tokenAddress',
      trim: 'auto'
    },
    balance: {
      field: 'balanceParsed',
      filters: balanceListFilters
    }
  }
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
    fields: TokenAccountsFields()
  }
}

const TokenAccount = () => {
  const tokenAccount = TokenAccounts()
  const { balance } = TokenAccountsFields()
  balance.filters = balanceFilters
  tokenAccount.fields = Object.assign(TokenAccountsFields(),
    {
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
  tokenAccount.fields.balance = balance
  return tokenAccount
}

const TokenByAddress = () => {
  const { balance, token, contract } = TokenAccount().fields
  balance.suffix = (value, filtered, row) => row.symbol
  balance.filters = balanceListFilters
  return {
    link: accountLink,
    formatRow: (data, parentData) => {
      const { decimals, name, symbol } = data
      const row = accountFormatRow(data, { decimals, name, symbol })
      row.contractAddress = setThisContract(data.contract, data)
      return row
    },
    formatLink,
    key: 'tokenAddress',
    fields: {
      name: Object.assign(token, { field: 'name', type: 'tokenName' }),
      address: Object.assign(contract, {
        field: 'contractAddress',
        link: (data, value, link) => value === THIS_CONTRACT ? null : value
      }),
      balance
    }
  }
}

export const tokenByAddress = TokenByAddress()
export const tokenAccount = TokenAccount()
export const tokenAccounts = TokenAccounts()
