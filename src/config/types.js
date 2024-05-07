
export const APP_NAME = 'RSK explorer'

export const ROUTES = {
  home: 'home',
  block: 'block',
  blocks: 'blocks',
  transaction: 'tx',
  transactions: 'txs',
  addresses: 'addresses',
  address: 'address',
  account: 'account',
  accounts: 'accounts',
  token: 'token',
  tokens: 'tokens',
  stats: 'stats',
  event: 'event',
  events: 'events',
  txPool: 'txpool',
  verifyContract: 'verify',
  checkAddress: 'check-address',
  search: 'search',
  internalTransactions: 'itxs',
  internalTx: 'itx',
  balance: 'balance',
  balances: 'balances',
  settings: 'settings',
  apps: 'apps'
}

export const PAGE_NAME = {
  TXS: [
    'Internal transaction',
    'Transaction',
    'Event',
    'Transactions'
  ],
  TOKENS: [
    'Token',
    'Tokens',
    'Token Account'
  ],
  ADDRESSES: [
    'Address',
    'Addresses',
    'Account Balance'
  ],
  BLOCKS: [
    'Block',
    'Blocks'
  ]
}

export const STATUS = {
  SUCCESS: 'SUCCESSFUL',
  FAIL: 'FAILED',
  QUEUED: 'QUEUED',
  PENDING: 'PENDING',
  REMOVED: 'REMOVED'
}

export const STATUS_ICONS = {
  SUCCESS: 'check',
  FAIL: 'close',
  QUEUED: 'buffer',
  PENDING: 'stopwatch',
  REMOVED: 'close'
}

export const THIS_ADDRESS = 'This Address'
export const THIS_CONTRACT = 'This Contract'

export const CONTRACT_UNKNOWN_NAME = '(Not provided)'
export const NOT_AVAILABLE = 'N/A'
export const CONTRACT_CREATED = 'contract created'
export const CONTRACT_FAILED = 'creation failed'

export const PAGE_NOT_FOUND = 'Page not found'

export const NEXT = 'next'
export const PREV = 'prev'
export const PAGE = 'page'
export const SORT = 'sort'
export const Q = 'q'

export const SEPARATOR = '__'

export const CONNECTION_STATUS = {
  CONNECTED: 'Connected',
  WAITING: 'Waiting for connection',
  LOST: 'Connection lost',
  UNABLE: 'Cannot connect to backend'
}

export const CONTEXT = {
  export: 'export'
}

export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv'
}

export const EXPORT_ITEMS = {
  LIST: 'listed',
  ALL: 'all'
}
