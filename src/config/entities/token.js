
import { ROUTES as r, CONTRACT_UNKNOWN_NAME } from '../types'
import { tokenAmount } from '../../filters/TokensFilters'

const tokenFormatRow = (data, parentData) => {
  let totalSupply = data.totalSupply
  let decimals = data.decimals
  if (undefined !== totalSupply && decimals) {
    data.totalSupplyParsed = tokenAmount(totalSupply, decimals)
  }
  return data
}

const Tokens = () => {
  return {
    icon: 'ellipsis',
    key: 'address',
    link: `/${r.address}/`,
    listLink: `/${r.tokens}/`,
    fields: {
      name: {
        field: 'name',
        default: CONTRACT_UNKNOWN_NAME,
        link: (data, value) => {
          return `/${r.address}/${data.address}`
        }
      },
      address: {
        field: 'address'
      },
      balance: {
        type: 'tokenBalance'
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
  formatRow: tokenFormatRow,
  fields: Object.assign(Tokens().fields, {
    symbol: null,
    contractType: null,
    address: { trim: 'auto' },
    decimals: {
      filters: ['big-number'],
      default: ''
    },
    totalSupply: {
      field: 'totalSupplyParsed',
      filters: ['big-number'],
      default: ''
    }
  }
  )

}

export const tokens = Tokens()
