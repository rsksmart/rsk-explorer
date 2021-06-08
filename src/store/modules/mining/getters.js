export const getLastRskBlocks = (state) => state.lastRskBlocks?.map(
  block => {
    const guessedMiner = block.blockInBtc?.btcInfo?.guessedMiner
    const btcHash = block.blockInBtc?.btcInfo?.hash
    const btcHeight = block.blockInBtc?.btcInfo?.height
    const BN = block.blockInBtc?.rskTag?.BN
    const CPV = block.blockInBtc?.rskTag?.CPV
    const NU = block.blockInBtc?.rskTag?.NU
    const prefixHash = block.blockInBtc?.rskTag?.prefixHash

    const blockInBtc = {
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
      hasBTCInfo: !!block.blockInBtc,
      blockInBtc,
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
