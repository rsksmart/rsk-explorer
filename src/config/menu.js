
import { ROUTES as r } from '../config/types'

const makeMenuItem = (key, { title, icon, path } = {}) => {
  title = (undefined === title) ? key : title
  icon = (undefined === icon) ? key : icon
  path = path || r[key]
  return { key, title, icon, path }
}

const parseMenu = menu => menu.map(m => {
  const key = (typeof m === 'string') ? m : m.key
  const args = (typeof m === 'object') ? m : {}
  return makeMenuItem(key, args)
})

const items = [
  'blocks',
  'transactions',
  'addresses',
  'tokens',
  'stats',
  { key: 'settings', title: false }
]
export const menuItems = parseMenu(items)

export default menuItems
