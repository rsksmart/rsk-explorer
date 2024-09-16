import precompiled from '@rsksmart/rsk-precompiled-abis'

const METHOD_TYPES = {
  read: 'read',
  write: 'write'
}

// ARROWHEAD
export const ALLOWED_BRIDGE_METHODS = {
  [METHOD_TYPES.read]: [
    'getBtcBlockchainBestChainHeight',
    'getStateForBtcReleaseClient',
    'getStateForDebugging',
    'getBtcBlockchainInitialBlockHeight',
    'getBtcBlockchainBlockHashAtDepth',
    'getBtcTxHashProcessedHeight',
    'isBtcTxHashAlreadyProcessed',
    'getFederationAddress',
    'getFederationSize',
    'getFederationThreshold',
    'getFederatorPublicKey',
    'getFederatorPublicKeyOfType',
    'getFederationCreationTime',
    'getFederationCreationBlockNumber',
    'getRetiringFederationAddress',
    'getRetiringFederationSize',
    'getRetiringFederationThreshold',
    'getRetiringFederatorPublicKeyOfType',
    'getRetiringFederationCreationTime',
    'getRetiringFederationCreationBlockNumber',
    'getPendingFederationHash',
    'getPendingFederationSize',
    'getPendingFederatorPublicKeyOfType',
    'getFeePerKb',
    'getMinimumLockTxValue',
    'getBtcTransactionConfirmations',
    'getLockingCap',
    'hasBtcBlockCoinbaseTransactionInformation',
    'getActiveFederationCreationBlockHeight',
    'getBtcBlockchainBestBlockHeader',
    'getBtcBlockchainBlockHeaderByHash',
    'getBtcBlockchainBlockHeaderByHeight',
    'getBtcBlockchainParentBlockHeaderByHash',
    'getEstimatedFeesForNextPegOutEvent',
    'getNextPegoutCreationBlockNumber',
    'getQueuedPegoutsCount',
    'getActivePowpegRedeemScript'
  ],
  [METHOD_TYPES.write]: [
    'registerBtcTransaction',
    'registerBtcCoinbaseTransaction',
    'receiveHeader'
  ]
}

export const isAllowedMethod = (name, type) => {
  try {
    if (!METHOD_TYPES[type]) throw new Error(`Invalid method type "${type}"`)

    return ALLOWED_BRIDGE_METHODS[type].includes(name)
  } catch (error) {
    console.error(error)
  }
}

// fix, until bridge abi becomes compliant with ethereum abi standard
export const formatBridgeFragments = (bridgeAbi) => {
  const formatWriteMethod = (fragment) => {
    return {
      ...fragment,
      constant: false, // switch to write method
      stateMutability: 'nonpayable' // allow ethers to recognize it as write method
    }
  }

  try {
    const formattedBridgeAbi = bridgeAbi.map(fragment => {
      if (!fragment || !fragment.name) throw new Error(`Invalid bridge abi fragment: ${JSON.stringify(fragment)}`)
      // format write methods only
      if (isAllowedMethod(fragment.name, METHOD_TYPES.write)) {
        return formatWriteMethod(fragment)
      }

      return fragment
    })

    return formattedBridgeAbi
  } catch (error) {
    console.error(`Error while formatting bridge abi fragments: ${error.message}`)
  }
}

export const bridge = {
  address: precompiled.bridge.address,
  rawAbi: precompiled.bridge.abi,
  abi: formatBridgeFragments(precompiled.bridge.abi)
}
