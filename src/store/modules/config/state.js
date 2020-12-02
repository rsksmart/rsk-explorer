import { EXPORT_FORMATS } from '../../../config/types'
export default function () {
  return {
    autoUpdateBlocks: false,
    sort: {},
    tables: {},
    exportFormat: EXPORT_FORMATS.JSON,
    exportType: undefined,
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
