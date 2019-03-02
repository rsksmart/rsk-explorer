
export const isRemascEvent = ({ event }) => (event === 'mining_fee_topic')

export const remascEventConfig = () => {
  return {
    fields: {
      to: {
        field: '_arguments.to',
        type: 'address',
        trim: 'auto'
      },
      blockHash: {
        field: '_arguments.blockHash',
        type: 'blockHash',
        trim: 'auto'
      },
      value: {
        field: '_arguments.value',
        filters: ['token-decimals', 'token-value', 'rbtc']
      }
    }
  }
}
