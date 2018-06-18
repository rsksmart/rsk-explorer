export default function () {
  return {
    serverTime: Date.now(),
    clientTime: Date.now(),
    systemSettings: {},
    requesting: {},
    responses: {},
    blocks: [],
    lastBlocks: [],
    pendingBlocks: {},
    dbStatus: {},
    lastBlocksTime: 0,
    transactions: [],
    lastTransactions: []
  }
}
