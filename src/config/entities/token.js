
import { ROUTES as r } from '../types'
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
        type: 'tokenName'
      },
      address: {
        field: 'address'
      },
      balance: {
        type: 'tokenBalance'
      },
      created: {
        field: 'createdByTx.timestamp',
        type: 'timestamp',
        hideIfEmpty: true
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
