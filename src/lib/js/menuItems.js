import { ROUTES as r } from '../../config/types'
import config from '../../config/config.json'
const menuItems = {}
for (let item of config.menuItems) {
  menuItems[item] = r[item]
}

export default menuItems
