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
      mainContent: [
        { component: DataItem }
      ],
      title: '',
      tabs: [
        {
          name: 'transactions',
          dataType: 'transactions',
          module: 'transactions',
          action: 'getTransactionsByBlock'
        }
      ]
    }
  }
]
