export default function () {
  return {
    autoUpdateBlocks: false,
    sort: {
    },
    q: {
      blocks: {
        getTransactions: {
          txType: ['normal']
        }
      }
    }
  }
}
