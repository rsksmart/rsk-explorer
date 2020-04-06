import { ROUTES as r } from '../../config/types'
import items from '../../config/menu.js'
const menuItems = {}
for (const item of items) {
  menuItems[item] = r[item]
}

export default menuItems
