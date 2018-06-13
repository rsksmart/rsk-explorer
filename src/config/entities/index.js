/**
 * type:{
 *    key: item key field
 *    formatRow(data,parentData)
 *    formatFields(fields,data,parentData)
 *    formatLink(data,parentData,link,key)
      fields:{
        field: null | object: {
                        field: key of data source, field name as default
                        type: field name as default
                        trim: Number
                        filters: [Array] of vue filters names
                        suffix:
                        renderTitle:{
                              icon: [boolean], render icon in title
                              title: [boolean], render title text
                        }
                        renderAs: [string] Vue commponent to render field
                        renderAsProps: [object] props to pass to component
                      }
      }
 * }
 */

import { block, blocks } from './block'
import { transaction, transactions } from './transaction'
import { address, addresses } from './address'
import { token, tokens } from './token'
import { event, events } from './event'
import { tokenAccount, tokenAccounts } from './tokenAccount'

export default {
  block,
  blocks,
  transaction,
  transactions,
  address,
  addresses,
  token,
  tokens,
  event,
  events,
  tokenAccount,
  tokenAccounts
}
