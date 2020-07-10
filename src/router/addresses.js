import DataPage from '@/components/DataPage'
import DataItem from '@/components/DataItem'
import ContractCode from '@/components/ContractCode'
import { ROUTES as r } from '../config/types'
import { TRANFER_EVENTS_SIGNATURES } from '../config/entities/lib/eventsLib'
import store from '../store/'
import { fillMessage, CHECKSUM_WARN } from '../config/messages'
import { balancesMessages } from './balances'

export default [
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
      msgs: (data) => {
        const msgs = []
        data = data || {}
        const { address } = data
        const checksumError = store.getters.getChecksumError(address)
        if (checksumError) {
          msgs.push(fillMessage(CHECKSUM_WARN, { address: checksumError }))
        }
        return msgs
      },
      title: (data) => {
        let title = (data.contractType === 'ERC20') ? 'token' : ''
        title = (data.name) ? `${data.name} ${title}` : title
        return title || data.type || ''
      },
      mainContent: [
        {
          name: 'general',
          component: DataItem
        },
        {
          name: 'Code',
          component: ContractCode,
          render: data => (data && data.type === 'contract' && !data.isNative),
          hideTabs: true,
          icon: data => {
            if (!data) return
            const { verification } = data
            if (verification && verification.match === true) return 'check'
          }
        }
      ],
      dataType: 'address',
      tabs: [
        {
          name: 'transactions',
          dataType: 'transactions',
          action: 'getTransactionsByAddress',
          module: 'transactions'
        },
        {
          name: 'internal transactions',
          dataType: 'internalTransactions',
          module: 'internalTransactions',
          action: 'getInternalTransactionsByAddress'
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
            const methods = data.contractMethods || []
            return methods.indexOf('balanceOf(address)') > -1
          }
        },
        {
          name: 'balances',
          dataType: 'balances',
          module: 'balances',
          action: 'getBalances',
          msgs: balancesMessages
        },
        {
          name: 'mined blocks',
          dataType: 'blocks',
          module: 'blocks',
          action: 'getBlocks',
          params: (routeParams) => {
            routeParams = routeParams || {}
            const { address } = routeParams
            return { miner: address }
          },
          render: data => {
            return !!data.lastBlockMined
          }
        }
      ]
    }
  }
]
