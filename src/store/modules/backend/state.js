export default function () {
  return {
    serverTime: Date.now(),
    clientTime: Date.now(),
    systemSettings: {},
    requesting: {},
    responses: {},
    totals: {},
    blocks: [],
    lastBlocks: [],
    pendingBlocks: {},
    dbStatus: {},
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
