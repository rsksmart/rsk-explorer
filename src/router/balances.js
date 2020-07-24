import DataPage from '@/components/DataPage'
import { ROUTES as r } from '../config/types'
import store from '../store/'
import { fillMessage, BALANCES_WARN } from '../config/messages'

const module = 'balances'

export const balancesMessages = data => {
  let { fromBlock, toBlock } = store.getters.getBalancesStatus
  fromBlock = fromBlock.blockNumber
  toBlock = toBlock.blockNumber
  return [fillMessage(BALANCES_WARN, { fromBlock, toBlock })]
}

export default [
  {
    path: `/${r.balances}/:address`,
    name: 'Accounts Balances',
    component: DataPage,
    props: {
      module,
      title: 'Account Balances',
      dataType: 'balances',
      action: 'getBalances',
      msgs: balancesMessages
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
