export default function () {
  return {
    autoUpdateBlocks: false,
    sort: {},
    tables: {},
    q: {
      txs: {
        getTransactions: {
          txType: ['normal']
        }
      }
    }
  }
}
