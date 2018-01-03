export default function () {
  return {
    serverTime: Date.now(),
    clientTime: Date.now(),
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
    transactions: [],
    lastTransactions: [],
    tokens: []
  }
}
