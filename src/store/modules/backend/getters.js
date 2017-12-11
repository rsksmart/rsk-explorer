export const firstListBlock = state => {
  return state.blocks[0]
}

export const lastListBlock = state => {
  return state.blocks[state.blocks.lenght]
}

export const blocksTransactions = state => {
  let blocks = state.blocks
  if (blocks.length) {
    return blocks
      .map(block => {
        return block.transactions.map(tx => {
          tx.timestamp = block.timestamp
          return tx
        })
      })
      .reduce((acc, item) => {
        return acc.concat(item)
      })
  }
}

export const pendingBlocks = state => {
  if (state.lastBlocks.length && state.blocks.length) {
    return state.lastBlocks[0].number - state.blocks[0].number
  }
}
