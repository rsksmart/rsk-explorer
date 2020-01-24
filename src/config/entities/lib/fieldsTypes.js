import {
  ROUTES as r,
  CONTRACT_UNKNOWN_NAME,
  NOT_AVAILABLE
} from '../../types'
import { isAddress } from '../../../lib/js/utils'

const hashrate = {
  icon: 'flame',
  titleIcon: true,
  hideTitle: true,
  filters: ['big-number', 'Hs']
}

export default {
  block: {
    icon: 'cube',
    titleIcon: true,
    hideTitle: true,
    link: `/${r.block}/`,
    filters: ['locale'],
    default: 0
  },
  blockHash: {
    link: `/${r.block}/`
  },
  bigNumber: {
    filters: ['big-number']
  },
  difficulty: {
    filters: ['big-number', 'H']
  },
  timestamp: {
    icon: 'stopwatch',
    filters: ['m-seconds-ago', 'add-ago'],
    titleIcon: true,
    hideTitle: true
  },
  transaction: {
    icon: 'transaction',
    link: `/${r.transaction}/`,
    titleIcon: true,
    hideTitle: true
  },
  miner: {
    icon: 'miner',
    titleIcon: true,
    hideTitle: true,
    link: `/${r.address}/`
  },
  hash: {
    icon: 'hash',
    titleIcon: true,
    hideTitle: true,
    trim: 'auto'
  },
  gas: {
    filters: ['locale']
  },
  gasPrice: {
    filters: ['tx-gas-price', 'rbtc'],
    trim: 'auto',
    default: 0
  },
  address: {
    link: (data, value) => (!isAddress(value)) ? null : `/${r.address}/${value}`,
    filters: ['checksum-address']
  },
  token: {
    link: `/${r.address}/`
  },
  date: {
    icon: 'calendar',
    filters: ['date-from-unix-ts'],
    titleIcon: true,
    hideTitle: true
  },
  tokenBalance: {
    filters: ['big-number', 'locale', 'rbtc'],
    default: 0
  },
  tokenAddress: {
    trim: 'auto',
    filters: ['checksum-address']
  },
  tokenName: {
    default: CONTRACT_UNKNOWN_NAME,
    trim: 'auto',
    link: ({ address }, value) => {
      return (!isAddress(address)) ? null : `/${r.address}/${address}`
    }
  },
  eventAddress: {
    link: (data, value) => (!isAddress(value)) ? null : `/${r.address}/${value}`,
    default: NOT_AVAILABLE
  },
  eventId: {
    icon: 'zap',
    titleIcon: true,
    hideTitle: true,
    link: `/${r.event}/`,
    trim: 'auto'
  },
  txDensity: {
    icon: 'server',
    titleIcon: true,
    hideTitle: true,
    filters: ['tx-density', 'txs-s']
  },
  rbtcBalance: {
    filters: ['round', 'locale', 'rbtc']
  },
  hashrate,
  blockHashrate: hashrate
}
