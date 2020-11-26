export default function () {
  return {
    autoUpdateBlocks: false,
    sort: {},
    tables: {},
    exportFormat: 'JSON',
    decimalPlaces: 4,
    q: {
      txs: {
        getTransactions: {
          txType: ['normal']
        }
      }
    }
  }
}
