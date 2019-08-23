export const getType = (obj) => {
  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase()
}

export const isHexString = str => {
  str = (str.substring(0, 2) === '0x') ? str.substring(2) : str
  return /^[0-9a-f]+$/i.test(str)
}

export const add0x = str => (isHexString(str) && str.substring(0, 2) !== '0x') ? `0x${str}` : str

export const normalizeSearch = value => {
  value = String(value).toLowerCase()
  value = (parseInt(value).toString() === Number(value).toString()) ? value : add0x(value)
  return value
}

export const plainObjectChanges = (oldObj, newObj) => {
  oldObj = oldObj || {}
  if (!newObj) return oldObj
  let diff = Object.assign(Object.assign({}, oldObj), newObj)
  for (let p in diff) {
    let newValue = newObj[p]
    let oldValue = oldObj[p]
    if (oldValue === newValue) delete diff[p]
  }
  return diff
}

export const ObjectIdToDate = id => {
  let timestamp = String(id).substr(0, 8)
  return new Date(parseInt(timestamp, 16) * 1000)
}

export const ObjectIdSecondsElapsed = id => (Date.now() - ObjectIdToDate(id)) / 1000
