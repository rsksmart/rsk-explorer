import { ROUTES as r } from '../types'
import { Addresses, Address } from './address'
import { valueFilters } from './lib/fieldsTypes'

const balanceLink = ({ address, blockNumber }) => `/${r.balance}/${address}/${blockNumber}`

const Balances = () => {
  const { balance } = Addresses().fields
  balance.filters = valueFilters(true)
  balance.link = balanceLink
  return {
    itemEntity: 'balance',
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
      balance
    }
  }
}

const Balance = () => {
  let { fields } = Balances()
  const { balance } = Address().fields
  balance.filters = valueFilters()

  // reset these fields for proper order display
  delete fields.block
  delete fields.date
  delete fields.balance

  fields = Object.assign(fields, {
    balance,
    address: { trim: 'auto' },
    blockHash: { trim: 'auto' },
    block: {
      field: 'blockNumber'
    },
    time: {
      field: 'timestamp',
      type: 'timestamp'
    },
    date: {
      field: 'timestamp',
      type: 'date'
    }
  })
  return {

    fields
  }
}

export const balance = Balance()
export const balances = Balances()
