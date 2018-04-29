import { colors, blocksColors } from '../lib/js/colors.js'
import config from '../config/config.json'
const menuItems = config.menuItems
export default function () {
  return {
    APP: process.env.APP,
    menuItems,
    date: Date.now(),
    dateInterval: null,
    size: {
      w: 0,
      h: 0
    },
    socketConnected: false,
    socketErrors: [],
    colors,
    blocksColors
  }
}
