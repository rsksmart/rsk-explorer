import DataPage from '@/components/DataPage'
import { ROUTES as r } from '../config/types'

const module = 'balances'

export default [
  {
    path: `/${r.balances}/:address`,
    name: 'Accounts Balances',
    component: DataPage,
    props: {
      module,
      title: 'Account Balances',
      dataType: 'balances',
      action: 'getBalances'
    }
  },
  {
    path: `/${r.balance}/:address/:block`,
    name: 'Account Balance',
    component: DataPage,
    props: {
      module,
      title: 'Account balance',
      dataType: 'balance',
      action: 'getBalance',
      params: {
        getPrevNext: true
      }
    }
  }
]
