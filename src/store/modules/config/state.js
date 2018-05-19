export default function () {
  return {
    autoUpdateBlocks: false,
    sort: {},
    tables: {},
    q: {
      blocks: {
        getTransactions: {
          txType: ['normal']
        }
      }
    }
  }
}
