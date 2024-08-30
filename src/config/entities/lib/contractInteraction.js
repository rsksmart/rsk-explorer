export const ABI_CATEGORIES = {
  contractConstructor: 'contractConstructor',
  events: 'events',
  readMethods: 'readMethods',
  writeMethods: 'writeMethods'
}

export const INTERACTION_METHOD_TYPES = {
  read: 'read',
  write: 'write',
  simulation: 'simulation'
}

export const CONTRACT_TYPES = {
  normal: 'normal',
  proxy: 'proxy'
}

const FRAGMENT_TYPES = {
  constructor: 'constructor',
  event: 'event',
  error: 'error',
  function: 'function',
  receive: 'receive',
  fallback: 'fallback'
}

/* Fragment types: constructor, event, function, fallback, receive */
export const removeAbiFragmentsByTypes = (abi, types) => {
  if (!Array.isArray(types)) throw new Error(`Error removing abi fragments. Types param must be an array. Provided: ${types})`)

  const validatedAbi = abi.filter(fragment => {
    const { type } = fragment

    if (!FRAGMENT_TYPES[type]) {
      console.warn(`Unknown type: '${type}' for fragment:`, fragment)
      // exclude unknown types by default
      return false
    }

    return true
  })

  const filteredAbi = validatedAbi.filter(fragment => !types.includes(fragment.type))

  return filteredAbi
}

export const removeNonFunctionFragmentsFromAbi = (abi) => {
  return removeAbiFragmentsByTypes(abi, ['constructor', 'event', 'fallback', 'receive', 'error'])
}
