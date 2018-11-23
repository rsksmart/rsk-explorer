import DataPage from '@/components/DataPage'
import { ROUTES as r } from '../config/types'

export default [
  {
    path: `/${r.tokens}`,
    name: 'Tokens',
    component: DataPage,
    props: {
      dataType: 'tokens',
      module: 'addresses',
      action: 'getTokens',
      title: 'Tokens'
    }
  },
  {
    path: `/${r.token}/:contract/${r.accounts}`,
    name: 'tokenAddresses',
    component: DataPage,
    props: {
      title: 'Token Accounts',
      module: 'tokens',
      dataType: 'tokenAccounts',
      action: 'getTokenAccounts'
    }
  },
  {
    path: `/${r.token}/:contract/${r.account}/:address`,
    name: 'tokenAddress',
    component: DataPage,
    props: {
      title: (data) => {
        let cData = data._contractData || {}
        let title = 'Token Account'
        return (cData.name) ? `${cData.name} ${title}` : title
      },
      module: 'tokens',
      dataType: 'tokenAccount',
      action: 'getTokenAccount',
      mainContent: null,
      headType: 'token'
    }
  },
  {
    path: `/${r.event}/:eventId`,
    name: 'Event',
    component: DataPage,
    props: {
      title: 'Event',
      module: 'events',
      dataType: 'event',
      action: 'getEvent'
    }
  }
]
