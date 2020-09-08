import DataPage from '@/components/DataPage'
import DataItem from '@/components/DataItem'
import { ROUTES as r } from '../config/types'
import { TRANSFER_EVENTS_SIGNATURES } from '../config/entities/lib/eventsLib'

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
    name: 'Token Accounts',
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
    name: 'Token Account',
    component: DataPage,
    props: {
      title: (data) => {
        const cData = data._contractData || {}
        const title = 'Token Account'
        return (cData.name) ? `${cData.name} ${title}` : title
      },
      module: 'tokens',
      dataType: 'tokenAccount',
      action: 'getTokenAccount',
      mainContent: [
        { component: DataItem }
      ],
      headType: 'token',
      tabs: [
        {
          name: 'transfers',
          dataType: 'transferEvents',
          module: 'events',
          action: 'getEventsByAddress',
          params: { signatures: TRANSFER_EVENTS_SIGNATURES },
          title: ({ contractName }) => (contractName) ? `${contractName} transfers` : 'Contract transfers'
        }
      ]

    }
  },
  {
    path: `/${r.event}/:eventId`,
    name: 'Event',
    component: DataPage,
    props: {
      mainContent: [
        {
          name: 'Event',
          dataType: 'event',
          component: DataItem
        },
        {
          name: 'Log',
          dataType: 'eventData',
          component: DataItem
        }
      ],
      title: 'Event',
      module: 'events',
      dataType: 'event',
      action: 'getEvent'

    }
  }
]
