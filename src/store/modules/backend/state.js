export default function () {
  return {
    serverTime: Date.now(),
    clientTime: Date.now(),
    page: {
      requesting: false,
      error: null,
      req: {},
      pages: {},
      data: []
    },
    blocks: [],
    lastBlocks: [],
    tokens: [],
    autoUpdateBlocks: false
  }
}
