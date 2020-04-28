import DataPage from '@/components/DataPage'
import { ROUTES as r } from '../config/types'

const module = 'internalTransactions'

export default [
  {
    path: `/${r.internalTransactions}`,
    name: 'internalTransactions',
    component: DataPage,
    props: {
      module,
      title: 'Internal transactions',
      dataType: 'internalTransactions',
      action: 'getInternalTransactions'
    }
  },
  {
    path: `/${r.internalTx}/:internalTxId`,
    name: 'internalTransaction',
    component: DataPage,
    props: {
      module,
      title: 'internal transaction',
      dataType: 'internalTransaction',
      action: 'getInternalTransaction',
      params: {
        getPrevNext: true
      }
    }
  }

]
