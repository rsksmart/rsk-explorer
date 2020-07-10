
import { textTemplate } from '../filters/TextFilters'
import { ROUTES as r } from './types'

export const fillMessage = (msg, data) => {
  const newMessage = Object.assign({}, msg)
  const { txt, link } = newMessage
  if (txt) newMessage.txt = textTemplate(txt, data)
  if (link) {
    link.to = textTemplate(link.to, data)
    newMessage.link = link
  }
  return newMessage
}

export const DB_OUTDATED = {
  title: 'Warning:',
  txt: 'The database is not up to date',
  type: 'error',
  icon: 'warning'
}

export const INTERNAL_TX_WARN = {
  title: 'Note:',
  txt: 'Internal transactions from contracts, including the Bridge, are not shown in the list below',
  type: 'warn'
}
export const CHECKSUM_WARN = {
  title: 'Warning:',
  txt: 'The verification code of address: @address does not match with current network',
  type: 'error',
  icon: 'warning',
  link: {
    name: 'show more',
    to: `/${r.checkAddress}/@address`
  }
}

export const BALANCES_WARN = {
  title: 'Note:',
  txt: 'Showing balances between blocks: #@fromBlock and #@toBlock',
  type: 'warn'
}

export default { DB_OUTDATED, INTERNAL_TX_WARN, CHECKSUM_WARN, BALANCES_WARN }
