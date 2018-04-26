import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Tokens from '@/components/Tokens'
import DataPage from '@/components/DataPage'
import { ROUTES as r } from '../config/types'
// import Transactions from '@/components/Transactions'
Vue.use(Router)

export default new Router({
  mode: 'history',
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
      path: `/${r.tokens}`,
      name: 'Tokens',
      component: Tokens
    },
    {
      path: `/${r.tokens}/:address/events`,
      name: 'Events',
      component: DataPage,
      props: {
        type: 'erc20',
        title: 'Events',
        component: 'ContractEvents',
        dataType: 'events',
        action: 'getEvents'
      }
    },
    {
      path: `/${r.tokens}/:address/events/:_id`,
      name: 'Event',
      component: DataPage,
      props: {
        title: 'Event',
        type: 'erc20',
        dataType: 'event',
        action: 'getEvent'
      }
    },
    {
      path: `/${r.tokens}/:address/accounts`,
      name: 'Accounts',
      component: DataPage,
      props: {
        title: 'Accounts',
        type: 'erc20',
        component: 'ContractAccounts',
        dataType: 'accounts',
        action: 'getAccounts'
      }
    },
    {
      path: `/${r.tokens}/:address/accounts/:account`,
      name: 'Account',
      component: DataPage,
      props: {
        type: 'erc20',
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
      path: `/${r.blocks}/:number`,
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
      component: DataPage,
      props: {
        type: 'blocks',
        dataType: 'address',
        action: 'getAddresses',
        title: 'Addresses'
      }
    },
    {
      path: `/${r.addresses}/:address`,
      component: DataPage,
      props: {
        type: 'blocks',
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
      path: `/${r.transactions}/:hash`,
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
