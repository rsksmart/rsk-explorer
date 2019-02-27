import Home from '@/components/Home'
import DataPage from '@/components/DataPage'
import DataItem from '@/components/DataItem'
import ErrorPage from '@/components/ErrorPage'
import TxPool from '@/components/TxPool'
import { ROUTES as r, PAGE_NOT_FOUND } from '../config/types'
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
            let { balance, txBalance } = parenData
            if (txBalance !== balance) msgs.push('INTERNAL_TX_WARN')
            return msgs
          }]
        },
        {
          name: 'tokens',
          dataType: 'tokenByAddress',
          module: 'tokens',
          action: 'getTokensByAddress'
        },
        {
          name: 'events',
          dataType: 'events',
          module: 'events',
          action: 'getAllEventsByAddress'
        },
        {
          name: 'tokens transfers',
          dataType: 'transferEvents',
          module: 'events',
          action: 'getEventsByAddress',
          params: { signatures: TRANFER_EVENTS_SIGNATURES }
        },
        {
          name: 'accounts',
          dataType: 'tokenAccounts',
          module: 'tokens',
          action: 'getTokenAccounts',
          render: data => {
            let methods = data.contractMethods || []
            return methods.indexOf('balanceOf(address)') > -1
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
      mainContent: [
        {
          name: 'Transaction',
          component: DataItem
        },
        {
          name: 'Logs',
          component: DataItem,
          dataType: 'transactionLogs',
          // render: (data) => data && data.receipt.logs.length,
          count: (data) => { return (data && data.receipt) ? data.receipt.logs.length : 0 }
        },
        {
          name: 'Token Transfers',
          component: DataItem,
          dataType: 'txTransferEvents',
          count: (data) => {
            let logs = []
            if (data && data.receipt) {
              logs = filterTransferEvents(data.receipt.logs)
            }
            return logs.length
          }
        }
      ],
      module: 'txs',
      title: 'Transaction',
      dataType: 'transaction',
      action: 'getTransactionWithAddressData'
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
