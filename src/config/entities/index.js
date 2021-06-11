/**
 * type:{
 *    key: item key field
 *    formatRow({data,parentData,fields,context})
 *    formatFields({fields, data, parentData, context})
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

import { block, blocks, blockBox, blockMining } from './block'
import { transaction, transactions, transactionsBox, transactionLogs, transactionLogItem, txTransferEvents } from './transaction'
import { address, addresses } from './address'
import { token, tokens } from './token'
import { tokenAccount, tokenAccounts, tokenByAddress } from './tokenAccount'
import { event, events, eventData, transferEvents } from './event'
import { txPool } from './txPool'
import { compilationSettings, externalLibraries, constructorArguments } from './verifiedContracts'
import { stats } from './stats'
import { internalTransaction, internalTransactions } from './internalTransaction'
import { balance, balances } from './balances'
import { lastBtcBlocks, lastRskBlocks, miningSummary } from './mining'

export default {
  block,
  blocks,
  blockBox,
  blockMining,
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
  eventData,
  tokenAccount,
  tokenAccounts,
  tokenByAddress,
  txPool,
  txTransferEvents,
  transferEvents,
  compilationSettings,
  externalLibraries,
  stats,
  internalTransaction,
  internalTransactions,
  balance,
  balances,
  lastBtcBlocks,
  lastRskBlocks,
  miningSummary,
  constructorArguments
}
