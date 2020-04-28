import DataPage from '@/components/DataPage'
import DataItem from '@/components/DataItem'
import { ROUTES as r } from '../config/types'

export default [
  {
    path: `/${r.blocks}`,
    name: 'Blocks',
    component: DataPage,
    props: {
      module: 'blocks',
      dataType: 'blocks',
      action: 'getBlocks',
      title: 'Blocks'
    }
  },
  {
    path: `/${r.block}/:number`,
    name: 'Block',
    component: DataPage,
    props: {
      module: 'blocks',
      dataType: 'block',
      action: 'getBlock',
      params: {
        getPrevNext: true
      },
      mainContent: [
        {
          name: 'Block',
          component: DataItem
        },
        {
          name: 'Mining',
          component: DataItem,
          dataType: 'blockMining'
        }
      ],
      title: 'Block',
      tabs: [
        {
          name: 'transactions',
          dataType: 'transactions',
          module: 'transactions',
          action: 'getTransactionsByBlock'
        },
        {
          name: 'internal transactions',
          dataType: 'internalTransactions',
          module: 'internalTransactions',
          action: 'getInternalTransactionsByBlock'
        }
      ]
    }
  }
]
