import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import DataPage from '@/components/DataPage'
import { ROUTES as r } from '../config/types'
import config from '../config/config.json'
// import Transactions from '@/components/Transactions'
Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
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
        let url = config.statsUrl
        if (!url) {
          let host = window.location.host.split('.')
          host[0] = 'stats'
          url = window.location.protocol + '//' + host.join('.')
        }
        window.open(url, '_blank')
      }
    },
    {
      path: `/${r.tokens}`,
      name: 'Tokens',
      component: DataPage,
      props: {
        type: 'blocks',
        dataType: 'tokens',
        action: 'getTokens',
        title: 'Tokens'
      }
    },
    {
      path: `/${r.token}/:address`,
      name: 'Token',
      component: DataPage,
      props: {
        type: 'blocks',
        dataType: 'events',
        action: 'getEvents',
        title: 'Token'
      }
    },
    {
      path: `/${r.token}/:address/events`,
      name: 'Events',
      component: DataPage,
      props: {
        type: 'blocks',
        title: 'Events',
        component: 'ContractEvents',
        dataType: 'events',
        action: 'getEvents'
      }
    },
    {
      path: `/${r.token}/:address/events/:_id`,
      name: 'Event',
      component: DataPage,
      props: {
        title: 'Event',
        type: 'blocks',
        dataType: 'event',
        action: 'getEvent'
      }
    },
    {
      path: `/${r.token}/:address/accounts`,
      name: 'Accounts',
      component: DataPage,
      props: {
        title: 'Accounts',
        type: 'blocks',
        component: 'ContractAccounts',
        dataType: 'accounts',
        action: 'getAccounts'
      }
    },
    {
      path: `/${r.token}/:address/accounts/:account`,
      name: 'Account',
      component: DataPage,
      props: {
        type: 'blocks',
        action: 'getAccount',
        component: 'Account'
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
        title: ''
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
      path: `/${r.address}/:address`,
      name: 'Address',
      component: DataPage,
      props: {
        type: 'blocks',
        title: (data, parentData) => parentData.type || '',
        headComponent: 'AccountHeader',
        dataType: 'transactions',
        action: 'getAddressTransactions'
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
    }
  ]
})
