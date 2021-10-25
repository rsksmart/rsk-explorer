import Web3 from 'web3'
import RNS from '@rsksmart/rns'

const rns = new RNS(new Web3(process.env.PUBLIC_NODE_URL))
const RNS_DOMAIN_MIN_LENGTH = 9

export const getAddr = async (domain) => {
  if (domain < RNS_DOMAIN_MIN_LENGTH) return domain
  return rns.addr(domain)
}
