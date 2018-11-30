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

import { block, blocks, blockBox } from './block'
import { transaction, transactions, transactionsBox, transactionLogs, transactionLogItem } from './transaction'
import { address, addresses } from './address'
import { token, tokens } from './token'
import { event, events } from './event'
import { tokenAccount, tokenAccounts } from './tokenAccount'
import { txPool } from './txPool'

export default {
  block,
  blocks,
  blockBox,
  transaction,
  transactions,
  transactionsBox,
  transactionLogs,
  transactionLogItem,
  address,
  addresses,
  token,
  tokens,
  event,
  events,
  tokenAccount,
  tokenAccounts,
  txPool
}
