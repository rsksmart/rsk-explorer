import Home from '@/components/Home'
import ErrorPage from '@/components/ErrorPage'
import TxPool from '@/components/TxPool'
import { ROUTES as r, PAGE_NOT_FOUND } from '../config/types'
import blocks from './blocks'
import transactions from './transactions'
import addresses from './addresses'
import tokens from './tokens'
import { filterTransferEvents, TRANFER_EVENTS_SIGNATURES } from '../config/entities/lib/eventsLib'
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
        let host = window.location.host.split('.')
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
  ...blocks,
  ...transactions,
  ...addresses,
  ...tokens,
  {
    path: '*',
    name: 'Error',
    component: ErrorPage,
    props: {
      error: { code: 'PAGE_NOT_FOUND', error: PAGE_NOT_FOUND }
    }
  }]
