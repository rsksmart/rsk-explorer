import DataPage from '@/components/DataPage'
import DataItem from '@/components/DataItem'
import { ROUTES as r } from '../config/types'
import { filterTransferEvents } from '../config/entities/lib/eventsLib'

const module = 'transactions'

export default [
  {
    path: `/${r.transactions}`,
    name: 'Transactions',
    component: DataPage,
    props: {
      module,
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
      module,
      title: 'Transaction',
      dataType: 'transaction',
      action: 'getTransactionWithAddressData',
      params: {
        getPrevNext: true
      },
      tabs: [
        {
          name: 'internal transactions',
          dataType: 'internalTransactions',
          module: 'internalTransactions',
          action: 'getInternalTransactionsByTxHash'
        }
      ]
    }
  }
]
