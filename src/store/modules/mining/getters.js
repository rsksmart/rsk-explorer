export const getLastRskBlocks = state => {
  if (!state.lastRskBlocks) return []

  return state.lastRskBlocks.map(block => {
    const guessedMiner =
      block.blockInBtc &&
      block.blockInBtc.btcInfo &&
      block.blockInBtc.btcInfo.guessedMiner
    const btcHash =
      block.blockInBtc &&
      block.blockInBtc.btcInfo &&
      block.blockInBtc.btcInfo.hash
    const btcHeight =
      block.blockInBtc &&
      block.blockInBtc.btcInfo &&
      block.blockInBtc.btcInfo.height
    const BN =
      block.blockInBtc && block.blockInBtc.rskTag && block.blockInBtc.rskTag.BN
    const CPV =
      block.blockInBtc &&
      block.blockInBtc.rskTag &&
      block.blockInBtc.rskTag.CPV
    const NU =
      block.blockInBtc && block.blockInBtc.rskTag && block.blockInBtc.rskTag.NU
    const prefixHash =
      block.blockInBtc &&
      block.blockInBtc.rskTag &&
      block.blockInBtc.rskTag.prefixHash

    const blockInBtc = {
      guessedMiner,
      btcHash,
      btcHeight,
      BN,
      CPV,
      NU,
      prefixHash
    }

    const {
      height,
      hash,
      timestamp,
      minerAddress,
      minerName,
      numberOfUncles,
      rskTag,
      rskNodeVersion
    } = block

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
  })
}

export const getMiningSummary = state => {
  const { miningSummary: summary } = state

  return {
    bestBtcBlock: summary && summary.btc.bestBlock,
    bestRskBlock: summary && summary.rsk.bestBlock,
    btcHashrate: summary && summary.btc.hashrate,
    rskHashrate: summary && summary.rsk.hashrate,
    rskOverBtcHashrate: summary && summary.rskOverBtcHashrate
  }
}

export const getDialogs = state => {
  if (state.dialogs.length) {
    return state.dialogs.filter(dialog => {
      return dialog._show === true
    })
  }
}
