import * as COLORS from '../../config/colors.json'
import * as chroma from 'chroma-js'

const autoColors = {
  iconColor: COLORS.color1,
  titleColor: COLORS.color2
}
export const colors = Object.assign(autoColors, COLORS)

const bez = chroma.bezier([COLORS.color1, COLORS.blue, COLORS.orange])

export const blocksColors = [
  bez(0.1).hex(),
  bez(0.2).hex(),
  bez(0.3).hex(),
  bez(0.4).hex(),
  bez(0.5).hex(),
  bez(0.6).hex(),
  bez(0.7).hex(),
  bez(0.8).hex(),
  bez(0.9).hex(),
  bez(1).hex()
]
export default JSON.stringify(colors)
