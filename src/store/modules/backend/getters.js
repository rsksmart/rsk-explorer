import { getLastBlock } from './state'

export const firstListBlock = state => {
  return state.blocks[0]
}

export const lastBlock = state => getLastBlock(state)

export const transactions = state => {
  return state.transactions
}

export const lastTransactions = state => {
  return state.responses?.data?.data
}

export const pendingBlocks = state => {
  return Object.keys(state.pendingBlocks).length
}

export const isRequesting = state => (key) => {
  return state.requesting[key]
}

export const pageError = state => key => {
  const page = state.responses[key] || {}
  const { error } = page
  return error
}
export const getPage = state => key => {
  return state.responses[key]
}

export const lastBlocksTime = state => {
  return state.lastBlocksTime
}

export const getPageTotal = (state, getters) => key => {
  const data = state.responses[key]
  const total = (data?.pages && data?.pages.total) ? data?.pages.total : state.totals[key] || null
  return total
}

export const getTxPoolQueued = (state) => {
  return state.txPool.queued
}

export const getTxPoolPending = (state) => {
  return state.txPool.pending
}

export const getTxPoolTxs = (state) => status => {
  const txs = state.txPool.txs || []
  return (status) ? txs.filter(tx => tx.status === status) : txs
}

export const contractVerifierEnabled = state => {
  const modules = state.systemSettings.modules || {}
  return modules.contractVerifier
}

export const bcNet = state => state.systemSettings.net

export const chainId = state => {
  const net = state.systemSettings.net
  return (net) ? net.id : undefined
}

export const isConfigLoaded = state => {
  return Object.keys(state.systemSettings).length > 0
}

export const netName = state => {
  const { name } = state.systemSettings.net || {}
  return name
}

export const networkName = (state, getters) => {
  const name = getters.netName || ''
  return (name) ? name.replace('RSK', '').trim().toLowerCase() : name
}

export const responseMetadata = state => key => {
  return state.responsesMetadata[key]
}

export const isResponseBlockUpdated = (state, getters) => key => {
  const metadata = getters.responseMetadata(key) || {}
  const lastBlock = getters.lastBlock
  if (metadata.block && lastBlock) return metadata.block.hash === lastBlock.hash
}

export const isExportKey = state => key => {
  const value = state.exports[key]
  return value !== undefined && value !== null
}

export const getExportMetadata = state => key => {
  if (!key) return
  return state.exports[key]
}
