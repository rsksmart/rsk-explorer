import { ROUTES as r } from '../types'
import { Addresses, Address } from './address'
import { round } from '../../filters/NumberFilters'

const balanceLink = ({ address, blockNumber }) => `/${r.balance}/${address}/${blockNumber}`

const Balances = () => {
  const { balance } = Addresses().fields
  balance.filters = ['tx-value', value => round(value, 8), 'rbtc']
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
