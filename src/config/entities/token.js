
import { ROUTES as r } from '../types'
import { totalSupplyField } from './address'

const tokenFormatRow = ({ data, parentData }) => {
  data._totalSupplyResult = totalSupplyField(data)
  return data
}

const Tokens = () => {
  return {
    itemEntity: 'address',
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
    contractInterfaces: null,
    address: { trim: 'auto' },
    decimals: {
      filters: ['big-number'],
      default: ''
    },
    totalSupply: {
      field: '_totalSupplyResult',
      filters: ['big-number'],
      default: ''
    }
  }
  )

}

export const tokens = Tokens()
