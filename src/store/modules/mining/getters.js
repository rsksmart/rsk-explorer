export const getLastRskBlocks = (state) => state.lastRskBlocks.map(
  block => ({
    ...block,
    blockInBtc: block.blockInBTC?.btcInfo?.height
  })
)

export const getMiningSummary = (state) => {
  const { miningSummary: summary } = state

  return {
    bestBtcBlock: summary.btc.bestBlock,
    bestRskBlock: summary.rsk.bestBlock,
    btcHashrate: summary.btc.hashrate,
    rskHashrate: summary.rsk.hashrate,
    rskOverBtcHashrate: summary.rskOverBtcHashrate
  }
}
