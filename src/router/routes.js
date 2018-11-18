import Home from '@/components/Home'
import DataPage from '@/components/DataPage'
import DataItem from '@/components/DataItem'
import ErrorPage from '@/components/ErrorPage'
import TxPool from '@/components/TxPool'
import { ROUTES as r, PAGE_NOT_FOUND } from '../config/types'
import { bignumber } from '../filters/TokensFilters'
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
      module: 'blocks',
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
      module: 'blocks',
      dataType: 'block',
      action: 'getBlock',
      mainContent: [
        { component: DataItem }
      ],
      title: '',
      tabs: [
        {
          name: 'transactions',
          dataType: 'transactions',
          module: 'txs',
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
      module: 'addresses',
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
      module: 'addresses',
      action: 'getAddress',
      title: (data) => {
        let title = (data.contractType === 'ERC20') ? 'token' : ''
        title = (data.name) ? `${data.name} ${title}` : title
        return title || data.type || ''
      },
      mainContent: [
        { component: DataItem }
      ],
      dataType: 'address',
      tabs: [
        {
          name: 'transactions',
          dataType: 'transactions',
          action: 'getTransactionsByAddress',
          module: 'txs',
          msgs: [(data, parenData) => {
            const msgs = []
            let balance = bignumber(parenData.balance)
            let txBalance = bignumber(parenData.txBalance)
            if (txBalance !== balance) msgs.push('INTERNAL_TX_WARN')
            return msgs
          }]
        },
        {
          name: 'events',
          dataType: 'events',
          module: 'events',
          action: 'getEventsByAddress'
        },
        {
          name: 'accounts',
          dataType: 'tokenAccounts',
          module: 'tokens',
          action: 'getTokenAccounts',
          render: data => {
            let methods = data.contractMethods || []
            return methods.indexOf('balanceOf') > -1
          }
        }
      ]
    }
  },
  {
    path: `/${r.transactions}`,
    name: 'Transactions',
    component: DataPage,
    props: {
      module: 'txs',
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
      module: 'txs',
      title: 'Transaction',
      dataType: 'transaction',
      action: 'getTransaction'
    }
  },
  {
    path: `/${r.txPool}`,
    name: 'txPool',
    component: TxPool
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
