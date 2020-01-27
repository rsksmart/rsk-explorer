import DataPage from '@/components/DataPage'
import DataItem from '@/components/DataItem'
import { ROUTES as r } from '../config/types'
import { filterTransferEvents } from '../config/entities/lib/eventsLib'

export default [
  {
    path: `/${r.transactions}`,
    name: 'Transactions',
    component: DataPage,
    props: {
      module: 'transactions',
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
      module: 'transactions',
      title: 'Transaction',
      dataType: 'transaction',
      action: 'getTransactionWithAddressData',
      params: {
        getPrevNext: true
      }
    }
  }
]
