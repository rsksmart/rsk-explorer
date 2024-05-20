import { ethers } from 'ethers'

export const jsonRpcProvider = new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

// const getBlockNumber = async () => {
//   const blockNumber = await jsonRpcProvider.getBlockNumber()
//   console.log({ blockNumber })
// }

// getBlockNumber()
