/* eslint-disable new-cap */
import Resolver from '@rsksmart/rns-resolver.js'

export const getAddr = async (domain) => {
  let resolver

  if (process.env.WS_URL.includes('testnet')) resolver = new Resolver.forRskTestnet()
  else resolver = new Resolver.forRskMainnet()

  return resolver.addr(domain)
}
