export const formatEvent = (event) => {
  let args = eventArgs(event)
  if (args) {
    event._arguments = args
  }
  return event
}

export const eventArgs = event => {
  if (event.abi) {
    event.args = event.args || []
    let inputs = event.abi.inputs || []
    return inputs.map(i => i.name).reduce((v, a, i) => {
      v[a] = event.args[i]
      return v
    }, {})
  }
}
