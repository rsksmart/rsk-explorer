import DataPage from '@/components/DataPage'
import DataItem from '@/components/DataItem'
import { ROUTES as r } from '../config/types'

const module = 'internalTransactions'

export default [
  {
    path: `/${r.internalTransactions}`,
    name: 'Internal transactions',
    component: DataPage,
    props: {
      module,
      title: 'Internal transactions',
      action: 'getInternalTransactions',
      dataType: 'internalTransactions'
    }
  },
  {
    path: `/${r.internalTx}/:internalTxId`,
    name: 'Internal transaction',
    component: DataPage,
    props: {
      module,
      title: 'internal transaction',
      dataType: 'internalTransaction',
      action: 'getInternalTransaction',
      params: {
        getPrevNext: true
      },
      mainContent: [
        {
          name: '',
          dataType: 'internalTransaction',
          component: DataItem
        }
      ]
    }

  }
]
