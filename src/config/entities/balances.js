import { ROUTES as r } from '../types'
import { Addresses, Address } from './address'
import { valueFilters } from './lib/fieldsTypes'

const balanceLink = ({ address, blockNumber }) => `/${r.balance}/${address}/${blockNumber}`

const Balances = () => {
  const { balance } = Addresses().fields
  balance.filters = valueFilters(true)
  balance.link = balanceLink
  return {
    icon: 'credit-card',
    key: 'address',
    formatLink: balanceLink,
    listLink: `/${r.balances}`,
    titleField: 'address',
    fields: {
      block: {
        field: 'blockNumber'
      },
      date: {
        field: 'timestamp',
        type: 'date'
      },
      time: {
        field: 'timestamp',
        type: 'timestamp'
      },
      balance
    }
  }
}

const Balance = () => {
  let { fields } = Balances()
  const { balance } = Address().fields
  balance.filters = valueFilters()
  fields = Object.assign(fields, {
    balance,
    address: { trim: 'auto' },
    blockHash: { trim: 'auto' }
  })
  return {

    fields
  }
}

export const balance = Balance()
export const balances = Balances()
