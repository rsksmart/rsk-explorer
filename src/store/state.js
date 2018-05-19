import { colors, blocksColors } from '../lib/js/colors.js'
import menuItems from '../lib/js/menuItems.js'
import config from '../config/config.json'
import mediaBreakpoints from '../config/media_breakpoints.json'
const content = config.content || {}
const messages = config.messages || {}
export default function () {
  return {
    loadingConfig: null,
    APP: process.env.APP,
    menuItems,
    mediaBreakpoints,
    messages,
    content,
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
