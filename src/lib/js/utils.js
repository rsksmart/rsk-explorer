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
