export const getLastRskBlocks = (state) => state.lastRskBlocks?.map(
  block => {
    const guessedMiner = block.blockInBTC?.btcInfo?.guessedMiner
    const btcHash = block.blockInBTC?.btcInfo?.hash
    const btcHeight = block.blockInBTC?.btcInfo?.height
    const BN = block.blockInBTC?.rskTag?.BN
    const CPV = block.blockInBTC?.rskTag?.CPV
    const NU = block.blockInBTC?.rskTag?.NU
    const prefixHash = block.blockInBTC?.rskTag?.prefixHash

    const blockInBTC = {
      guessedMiner,
      btcHash,
      btcHeight,
      BN,
      CPV,
      NU,
      prefixHash
    }

    const { height, hash, timestamp, minerAddress, minerName, numberOfUncles, rskTag, rskNodeVersion } = block

    const lastRskBlocks = {
      hasBTCInfo: !!block.blockInBTC,
      ...blockInBTC,
      height,
      hash,
      timestamp,
      minerAddress,
      minerName,
      numberOfUncles,
      rskTag,
      rskNodeVersion
    }

    return lastRskBlocks
  }
) || []

export const getMiningSummary = (state) => {
  const { miningSummary: summary } = state

  return {
    bestBtcBlock: summary?.btc.bestBlock,
    bestRskBlock: summary?.rsk.bestBlock,
    btcHashrate: summary?.btc.hashrate,
    rskHashrate: summary?.rsk.hashrate,
    rskOverBtcHashrate: summary?.rskOverBtcHashrate
  }
}

export const getDialogs = (state) => {
  if (state.dialogs.length) {
    return state.dialogs.filter((dialog) => {
      return dialog._show === true
    })
  }
}
