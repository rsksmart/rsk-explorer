import * as COLORS from '../../config/colors.json'
import * as chroma from 'chroma-js'

const autoColors = {
  iconColor: COLORS.color1,
  titleColor: COLORS.color1
}
export const colors = Object.assign(autoColors, COLORS)
const bez = chroma.bezier([COLORS.green, chroma(COLORS.green).brighten()])

export const blocksColors = Array.apply(null, Array(10))
  .map((p, i) => {
    return bez(0.1 * i).hex()
  })

export default JSON.stringify(colors)
