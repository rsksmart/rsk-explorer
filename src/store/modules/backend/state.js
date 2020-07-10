export default function () {
  return {
    serverTime: Date.now(),
    clientTime: Date.now(),
    systemSettings: {},
    requesting: {},
    responses: {},
    responsesMetadata: {},
    totals: {},
    blocks: [],
    lastBlocks: [],
    pendingBlocks: {},
    dbStatus: {},
    balancesStatus: {},
    missingBlocks: {
      blocks: 1,
      time: 0
    },
    lastBlocksTime: 0,
    transactions: [],
    lastTransactions: [],
    txPool: {
      pending: 0,
      queued: 0,
      txs: [],
      timestamp: 0
    },
    txPoolChart: [],
    stats: {}
  }
}

export const getLastBlock = state => {
  const { lastBlocks } = state
  return lastBlocks[0]
}
