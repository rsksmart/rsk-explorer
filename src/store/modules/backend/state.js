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
      data: []
    },
    blocks: [],
    lastBlocks: [],
    lastBlocksTime: 0,
    transactions: [],
    lastTransactions: [],
    tokens: []
  }
}
