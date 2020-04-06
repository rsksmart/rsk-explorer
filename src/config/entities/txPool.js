import { Transactions, Tx, txStatusCss } from './transaction'

const pool = () => {
  const pool = Transactions()
  const fields = ['hash', 'gas', 'from', 'to', 'value']
  Object.keys(pool.fields).forEach(f => {
    if (!fields.includes(f)) delete pool.fields[f]
  })

  pool.fields = Object.assign(pool.fields, {
    status: {
      field: 'status',
      css: txStatusCss
    }
  })
  pool.fields.to.css = null
  return pool
}

const tx = () => {
  return Tx()
}

export const txPool = pool()
export const txInPool = tx()
