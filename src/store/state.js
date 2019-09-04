import { colors, blocksColors, blocksColors2 } from '../lib/js/colors.js'
import menuItems from '../lib/js/menuItems.js'
import messages from '../config/messages'
import content from '../config/content'
import mediaBreakpoints from '../config/media_breakpoints.json'

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
    socketConnectionStart: 0,
    socketConnectionEnd: 0,
    socketErrors: [],
    colors,
    blocksColors,
    blocksColors2
  }
}
