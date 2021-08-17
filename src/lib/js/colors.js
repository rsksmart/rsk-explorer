import COLORS from '../../config/colors.json'
import chroma from 'chroma-js'

const autoColors = {
  iconColor: COLORS.color1,
  titleColor: COLORS.color1
}

const minerColors = {
  'BTC.com': COLORS.brand1,
  SlushPool: COLORS.red,
  F2Pool: COLORS.green,
  ViaBTC: COLORS.violet,
  HuobiPool: COLORS.blue,
  Poolin: COLORS.gray,
  SpiderPool: COLORS.brand1,
  AntPool: COLORS.orange,
  NovaBlock: COLORS.brand3,
  Binance: COLORS.color1,
  '1THash': COLORS.color2,
  others: COLORS.cyan,
  unknown: COLORS.titleColor
}

export const colors = Object.assign(autoColors, minerColors, COLORS)

const bez = chroma.bezier([COLORS.green, chroma(COLORS.green).brighten()])

const bez2 = chroma.bezier([COLORS.color1, COLORS.blue, COLORS.orange])

export const blocksColors = Array.apply(null, Array(10))
  .map((p, i) => {
    return bez(0.1 * i).hex()
  })

export const blocksColors2 = Array.apply(null, Array(10))
  .map((p, i) => {
    return bez2(0.1 * i).hex()
  })

export default JSON.stringify(colors)
