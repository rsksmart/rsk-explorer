import DataPage from '@/components/DataPage'
import DataItem from '@/components/DataItem'
import { ROUTES as r } from '../config/types'

export default [
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
      headComponent: DataItem,
      headType: 'token'
    }
  },
  {
    path: `/${r.token}/:contract/${r.accounts}`,
    name: 'tokenAddresses',
    component: DataPage,
    props: {
      title: 'Token Accounts',
      type: 'blocks',
      dataType: 'tokenAccounts',
      action: 'getTokenAccounts'
    }
  },
  {
    path: `/${r.token}/:contract/${r.account}/:address`,
    name: 'tokenAddress',
    component: DataPage,
    props: {
      title: 'Token Account',
      type: 'blocks',
      dataType: 'tokenAccount',
      action: 'getTokenAccount',
      headComponent: DataItem,
      headType: 'token'
    }
  },
  {
    path: `/${r.token}/:address/${r.event}/:id`,
    name: 'Event',
    component: DataPage,
    props: {
      title: 'Event',
      type: 'blocks',
      dataType: 'event',
      action: 'getEvent'
    }
  }
]
