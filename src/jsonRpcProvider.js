import { ethers } from 'ethers'

export const envNetwork = process.env.NETWORK

if (!['mainnet', 'testnet'].includes(envNetwork)) throw new Error(`Invalid env network provided: "${envNetwork}"`)

export const rskNetworks = {
  mainnet: {
    chainName: 'Rootstock Mainnet - RPC API',
    chainId: '0x1e', // 30
    nativeCurrency: {
      name: 'Smart Bitcoin',
      symbol: 'RBTC',
      decimals: 18
    },
    rpcUrls: [
      'https://public-node.rsk.co'
    ],
    blockExplorerUrls: [
      'https://explorer.rootstock.io/',
      'https://rootstock.blockscout.com/' // fallback
    ]
  },
  testnet: {
    chainName: 'Rootstock Testnet - RPC API',
    chainId: '0x1f', // 31
    nativeCurrency: {
      name: 'Test Smart Bitcoin',
      symbol: 'tRBTC',
      decimals: 18
    },
    rpcUrls: [
      'https://public-node.testnet.rsk.co'
    ],
    blockExplorerUrls: [
      'https://explorer.testnet.rootstock.io/',
      'https://rootstock-testnet.blockscout.com/' // fallback
    ]
  }
}

export const jsonRpcProvider = () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      rskNetworks[envNetwork].rpcUrls[0],
      {
        name: rskNetworks[envNetwork].chainName,
        chainId: parseInt(rskNetworks[envNetwork].chainId)
      }
    )

    return provider
  } catch (error) {
    console.error('Error creating jsonRpcProvider instance:', error)
  }
}

export const browserProvider = () => {
  try {
    const browserProvider = new ethers.providers.Web3Provider(window.ethereum)

    return browserProvider
  } catch (error) {
    console.error('Error creating web3 browser provider instance:', error)
  }
}

// const getBlockNumber = async () => {
//   const blockNumber = await jsonRpcProvider.getBlockNumber()
//   console.log({ blockNumber })
// }

// getBlockNumber()
