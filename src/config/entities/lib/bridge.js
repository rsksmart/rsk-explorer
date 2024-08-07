import precompiled from '@rsksmart/rsk-precompiled-abis'

export const bridge = {
  address: precompiled.bridge.address,
  abi: precompiled.bridge.abi
}

// ARROWHEAD
export const ALLOWED_BRIDGE_METHODS = {
  read: [
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
  write: [
    'registerBtcTransaction',
    'registerBtcCoinbaseTransaction',
    'receiveHeader'
  ]
}
