export const firstListBlock = state => {
  return state.blocks[0]
}

export const lastListBlock = state => {
  return state.blocks[state.blocks.lenght]
}

export const transactions = state => {
  return state.transactions
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
  const { pages } = data
  const total = (pages && pages.total) ? pages.total : state.totals[key] || null
  return total
}

export const getTxPoolQueued = (state) => {
  return state.txPool.queued
}

export const getTxPoolPending = (state) => {
  return state.txPool.pending
}

export const getTxPoolTxs = (state) => status => {
  let txs = state.txPool.txs || []
  return (status) ? txs.filter(tx => tx.status === status) : txs
}
