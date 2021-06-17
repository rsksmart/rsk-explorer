import colors from './colors.json'
const options = () => {
  return {
    domain: {
      min: 0,
      max: null
    },
    fontSize: 12,
    margin: 0,
    curve: false,
    bars: true,
    padding: 0.25,
    colors: [colors.color2, colors.color2],
    axis: {
      valuesY: true,
      valuesX: true,
      linesY: false,
      linesX: false
    },
    marks: false
  }
}

export default options()
