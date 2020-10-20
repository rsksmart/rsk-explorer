export default function () {
  return {
    autoUpdateBlocks: false,
    sort: {},
    tables: {},
    exportFormat: 'JSON',
    q: {
      txs: {
        getTransactions: {
          txType: ['normal']
        }
      }
    }
  }
}
