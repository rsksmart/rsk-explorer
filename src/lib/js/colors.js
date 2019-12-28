import COLORS from '../../config/colors.json'
import chroma from 'chroma-js'

const autoColors = {
  iconColor: COLORS.color1,
  titleColor: COLORS.color1
}
export const colors = Object.assign(autoColors, COLORS)

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
