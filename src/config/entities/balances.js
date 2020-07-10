import { ROUTES as r } from '../types'
import { Address, Addresses } from './address'

const Balances = () => {
  const { balance } = Addresses().fields
  return {
    icon: 'credit-card',
    key: 'address',
    formatLink: ({ address, blockNumber }) => `/${r.balance}/${address}/${blockNumber}`,
    listLink: `/${r.balances}`,
    titleField: 'address',
    fields: {
      block: {
        field: 'blockNumber'
      },
      blockHash: {
        type: 'hash',
        trim: 8
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
