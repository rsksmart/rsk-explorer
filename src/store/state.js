import { colors, blocksColors } from '../lib/js/colors.js'

export default function () {
  return {
    APP: process.env.APP,
    date: Date.now(),
    dateInterval: null,
    size: {
      w: 0,
      h: 0
    },
    socketConnected: false,
    socketErrors: [],
    config: {
      autoUpdateBlocks: false
    },
    colors,
    blocksColors
  }
}
