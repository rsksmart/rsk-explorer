
const replacer = (k, v) => v === undefined ? `${v}` : v

const csvLine = content => content.map(c => {
  if (typeof c === 'object' && c !== null) c = JSON.stringify(c, replacer).replace(/"/g, '\'')
  return JSON.stringify(`${c}`)
}).join(',')

export function json2Csv (obj, { keys, excludeTitles } = {}) {
  if (typeof obj === 'string') obj = JSON.parse(obj)
  if (!obj || typeof obj !== 'object') throw new Error('Invalid obj')
  obj = Array.isArray(obj) ? obj : [obj]
  const csv = []

  keys = keys || Object.keys(obj[0])
  if (!Array.isArray(keys)) throw new Error('Missing keys')
  if (!excludeTitles) csv.push(csvLine(keys))

  for (const item of obj) {
    csv.push(csvLine(keys.map(k => item[k])))
  }
  return csv.join('\n')
}
