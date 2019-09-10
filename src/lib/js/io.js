export const locStorage = {
  set (key, data) {
    data = JSON.stringify(data)
    localStorage.setItem(key, data)
  },
  get (key) {
    let data = localStorage.getItem(key)
    if (data !== null) {
      return JSON.parse(data)
    }
    return null
  }
}

export const downloadText = (content, name, type = 'json') => {
  name = name || `download.${type}`
  let data = `data:text/${type};charset=utf-8,${encodeURIComponent(content)}`
  let el = document.createElement('a')
  el.setAttribute('href', data)
  el.setAttribute('download', name)
  el.click()
}

export const storageAvailable = (type) => {
  try {
    var storage = window[type]
    let x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
  }
}

export const loadJSON = (file, cb) => {
  return readTextFile(file, cb, 'application/json')
}

export const readTextFile = (file, cb, type) => {
  return new Promise((resolve, reject) => {
    if (type) {
      if (!file || file.type !== type) reject(new Error('file type mismatch'))
    }
    let reader = new FileReader()
    reader.onload = (event) => {
      resolve(event.target.result)
    }
    reader.readAsText(file)
  })
}

const copyTextStyle = {
  border: 'none',
  margin: 0,
  padding: 0,
  'background-color': 'inherit',
  opacity: 0,
  width: '1px',
  height: '1px'
}

export const copyText = (targetNode, attributes) => {
  if (!targetNode) throw new Error('Invalid node')
  let style = Object.entries(copyTextStyle).map(p => p.join(':')).join(';')
  attributes = attributes || { style }
  let value = targetNode.value || targetNode.innerText
  let el = targetNode.parentNode
  let ta = document.createElement('textarea')
  for (let att in attributes) {
    ta.setAttribute(att, attributes[att])
  }
  ta.value = value
  let node = el.appendChild(ta)
  try {
    ta.select()
    document.execCommand('copy')
    el.removeChild(node)
    return
  } catch (err) {
    throw err
  }
}
