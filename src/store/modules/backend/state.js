export default function () {
  return {
    serverTime: Date.now(),
    clientTime: Date.now(),
    requestingBlocks: true,
    blocks: [],
    lastBlocks: [],
    tokens: []
  }
}
