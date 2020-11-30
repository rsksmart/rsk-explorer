import Home from '@/components/Home'
import ErrorPage from '@/components/ErrorPage'
import TxPool from '@/components/TxPool'
import CheckAddress from '@/components/CheckAddress'
import SearchPage from '@/components/SearchPage'
import MiningPage from '@/components/mining/MiningPage'
import { ROUTES as r, PAGE_NOT_FOUND } from '../config/types'
import blocks from './blocks'
import transactions from './transactions'
import addresses from './addresses'
import tokens from './tokens'
import contracts from './contracts'
import internalTransactions from './internalTransactions'
import balances from './balances'
const statsUrl = process.env.STATS_URL

export default [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: `/${r.accounts}`,
    redirect: `/${r.addresses}`
  },
  {
    path: `/${r.stats}`,
    name: 'stats',
    beforeEnter (t, f) {
      let url = statsUrl
      if (!url) {
        const host = window.location.host.split('.')
        host[0] = 'stats'
        url = window.location.protocol + '//' + host.join('.')
      }
      window.open(url, '_blank')
    }
  },
  {
    path: `/${r.txPool}`,
    name: 'txPool',
    component: TxPool
  },
  {
    path: `/${r.checkAddress}/:address`,
    name: 'CheckAddress',
    component: CheckAddress,
    props: true
  },
  {
    path: `/${r.search}/:value`,
    name: 'Search',
    component: SearchPage,
    props: true
  },
  {
    path: `/${r.mining}`,
    name: 'Mining',
    component: MiningPage
  },
  ...blocks,
  ...transactions,
  ...addresses,
  ...tokens,
  ...contracts,
  ...internalTransactions,
  ...balances,
  {
    path: '*',
    name: 'Error',
    component: ErrorPage,
    props: {
      error: { code: 'PAGE_NOT_FOUND', error: PAGE_NOT_FOUND }
    }
  }
]
