export const firstListBlock = state => {
  return state.blocks[0]
}

export const lastListBlock = state => {
  return state.blocks[state.blocks.lenght]
}

export const transactions = state => {
  return state.transactions
}

export const pendingBlocks = state => {
  return Object.keys(state.pendingBlocks).length
}

export const requestingPageData = state => (key) => {
  return state.requesting[key]
}

export const pageError = state => key => {
  return state.responses[key].error
}
export const getPage = state => key => {
  return state.responses[key]
}

export const lastBlocksTime = state => {
  return state.lastBlocksTime
}

export const getPageTotal = (state, getters) => key => {
  const pages = getters.getPage(key).pages
  const total = (pages && pages.total) ? pages.total : 0
  return total
}
