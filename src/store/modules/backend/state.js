export default function () {
  return {
    serverTime: Date.now(),
    clientTime: Date.now(),
    systemSettings: {},
    page: {
      requesting: false,
      error: null,
      req: {},
      pages: {},
      prev: {},
      next: {},
      sort: null,
      data: []
    },
    blocks: [],
    lastBlocks: [],
    dbStatus: {},
    lastBlocksTime: 0,
    transactions: [],
    lastTransactions: [],
    tokens: []
  }
}
