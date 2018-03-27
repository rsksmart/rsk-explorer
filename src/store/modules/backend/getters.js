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
  if (state.lastBlocks.length && state.blocks.length) {
    // rewrite this
    return state.lastBlocks[0].number - state.blocks[0].number
  }
}

export const requestingPageData = state => {
  return state.page.requesting
}

export const requestedPage = state => {
  return state.page.req
}

export const pageError = state => {
  return state.page.error
}
export const getPage = state => {
  return state.page
}

export const getPageAccount = (state, getters) => {
  let page = getters.getPage
  if (page && page.req && page.req.options) {
    return page.req.options.account
  }
}

export const lastBlocksTime = (state) => {
  return state.lastBlocksTime
}
