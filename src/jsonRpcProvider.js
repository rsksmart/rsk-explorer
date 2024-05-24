import { ethers } from 'ethers'

const rpcServiceApiUrl = process.env.JSON_RPC_PROVIDER

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
      rpcServiceApiUrl,
      'https://public-node.rsk.co' // fallback
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
      rpcServiceApiUrl,
      'https://public-node.testnet.rsk.co' // fallback
    ],
    blockExplorerUrls: [
      'https://explorer.testnet.rootstock.io/',
      'https://rootstock-testnet.blockscout.com/' // fallback
    ]
  }
}

export const jsonRpcProvider = new ethers.providers.JsonRpcProvider(
  rpcServiceApiUrl,
  {
    name: rskNetworks[envNetwork].chainName,
    chainId: parseInt(rskNetworks[envNetwork].chainId)
  }
)

export const getBrowserProvider = () => new ethers.providers.Web3Provider(window.ethereum)

// const getBlockNumber = async () => {
//   const blockNumber = await jsonRpcProvider.getBlockNumber()
//   console.log({ blockNumber })
// }

// getBlockNumber()
