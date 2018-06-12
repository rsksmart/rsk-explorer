
import { ROUTES as r, CONTRACT_UNKNOWN_NAME } from '../types'
const Tokens = () => {
  return {
    icon: 'ellipsis',
    key: 'address',
    link: `/${r.token}/`,
    listLink: `/${r.tokens}/`,
    fields: {
      name: {
        field: 'name',
        default: CONTRACT_UNKNOWN_NAME,
        link: (data, value) => {
          return `/${r.token}/${data.address}`
        }
      },
      address: {
        field: 'address'
      },
      balance: {
        type: 'balance'
      }
    }
  }
}

export const token = {
  icon: 'ellipsis',
  key: 'address',
  link: `/ ${r.tokens} /`,
  itemTitle: true,
  titleField: 'name',
  fields: {
    name: {
      default: CONTRACT_UNKNOWN_NAME
    },
    symbol: null,
    contractType: null,
    address: { trim: 'auto' },
    decimals: {
      filters: ['big-number'],
      default: ''
    },
    totalSupply: {
      filters: ['big-number'],
      default: ''
    },
    balance: {
      type: 'balance'
    }
  }
}

export const tokens = Tokens()
