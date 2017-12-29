import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Tokens from '@/components/Tokens'
import DataPage from '@/components/DataPage'
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
      path: '/tokens',
      name: 'Tokens',
      component: Tokens
    },
    {
      path: '/tokens/:address/events',
      name: 'Events',
      component: DataPage,
      props: {
        type: 'erc20',
        action: 'getEvents',
        component: 'ContractEvents'
      }
    },
    {
      path: '/tokens/:address/event/:_id',
      name: 'Event',
      component: DataPage,
      props: {
        type: 'erc20',
        action: 'getEvent',
        component: ''
      }
    },
    {
      path: '/tokens/:address/accounts',
      name: 'Accounts',
      component: DataPage,
      props: {
        type: 'erc20',
        action: 'getAccounts',
        component: 'ContractAccounts'
      }
    },
    {
      path: '/tokens/:address/account/:account',
      name: 'Account',
      component: DataPage,
      props: {
        type: 'erc20',
        action: 'getAccount',
        component: 'Account'
      }
    },
    {
      path: '/blocks',
      name: 'Blocks',
      component: DataPage,
      props: {
        type: 'blocks',
        action: 'getBlocks',
        component: 'Blocks',
        fields: ['number', 'transactions', 'hash', 'timestamp', 'size']
      }
    },
    {
      path: '/blocks/:block',
      name: 'Block',
      component: DataPage,
      props: {
        type: 'blocks',
        component: 'Block',
        action: 'getBlock',
        title: ''
      }
    },
    {
      path: '/accounts/:address',
      name: 'Address',
      component: DataPage,
      props: { type: 'blocks' }
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: DataPage,
      props: {
        type: 'blocks',
        component: 'Transactions',
        action: 'getTransactions'
      }
    },
    {
      path: '/transactions/:tx',
      name: 'Transaction',
      component: DataPage,
      props: { type: 'blocks', action: 'getTransaction' }
    }
  ]
})
