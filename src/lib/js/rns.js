import Web3 from 'web3'
import RNS from '@rsksmart/rns'
import { isValidDomain } from '@rsksmart/rns/lib/utils'

const rns = new RNS(new Web3(process.env.PUBLIC_NODE_URL))

export const getAddr = async (domain) => {
  if (!isValidDomain(domain)) return domain
  return rns.addr(domain)
}
