import { colors, blocksColors } from '../lib/js/colors.js'
import menuItems from '../lib/js/menuItems.js'

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
