import { ROUTES as r } from '../../config/types'
import items from '../../config/menu.js'
const menuItems = {}
for (let item of items) {
  menuItems[item] = r[item]
}

export default menuItems
