import Home from '@/components/Home'
import DataPage from '@/components/DataPage'
import DataItem from '@/components/DataItem'
import ErrorPage from '@/components/ErrorPage'
import { ROUTES as r, PAGE_NOT_FOUND } from '../config/types'
import tokens from './tokens'
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
    path: `/${r.blocks}`,
    name: 'Blocks',
    component: DataPage,
    props: {
      type: 'blocks',
      dataType: 'blocks',
      action: 'getBlocks',
      title: 'Blocks'
    }
  },
  {
    path: `/${r.block}/:number`,
    name: 'Block',
    component: DataPage,
    props: {
      type: 'blocks',
      dataType: 'block',
      action: 'getBlock',
      headComponent: DataItem,
      title: '',
      tabs: [
        {
          name: 'transactions',
          dataType: 'transactions',
          action: 'getTransactionsByBlock'
        }
      ]
    }
  },
  {
    path: `/${r.addresses}`,
    name: 'Addresses',
    component: DataPage,
    props: {
      type: 'blocks',
      dataType: 'addresses',
      action: 'getAddresses',
      title: 'Addresses'
    }
  },
  {
    path: '/addr/:address',
    redirect: `/${r.address}/:address`
  },
  {
    path: `/${r.address}/:address`,
    name: 'Address',
    component: DataPage,
    props: {
      type: 'blocks',
      title: (data) => {
        let title = (data.contractType === 'ERC20') ? 'token' : ''
        title = (data.name) ? `${data.name} ${title}` : title
        return title || data.type || ''
      },
      headComponent: DataItem,
      dataType: 'address',
      action: 'getAddress',
      tabs: [
        {
          name: 'transactions',
          dataType: 'transactions',
          action: 'getTransactionsByAddress',
          msgs: ['INTERNAL_TX_WARN']
        },
        {
          name: 'events',
          dataType: 'events',
          action: 'getEventsByAddress'
        },
        {
          name: 'accounts',
          dataType: 'tokenAccounts',
          action: 'getTokenAccounts',
          render: data => (data ? data.contractType === 'ERC20' : false)
        }
      ]
    }
  },
  {
    path: `/${r.transactions}`,
    name: 'Transactions',
    component: DataPage,
    props: {
      type: 'blocks',
      title: 'Transactions',
      dataType: 'transactions',
      action: 'getTransactions'
    }
  },
  {
    path: `/${r.transaction}/:hash`,
    name: 'Transaction',
    component: DataPage,
    props: {
      type: 'blocks',
      title: 'Transaction',
      dataType: 'transaction',
      action: 'getTransaction'
    }
  },
  ...tokens,
  {
    path: '*',
    name: 'Error',
    component: ErrorPage,
    props: {
      error: { code: 'PAGE_NOT_FOUND', error: PAGE_NOT_FOUND }
    }
  }]
