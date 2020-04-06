const isBrowser = typeof window !== 'undefined'

export const createLocStorage = () => {
  const { localStorage } = window
  return {
    set (key, data) {
      data = JSON.stringify(data)
      localStorage.setItem(key, data)
    },
    get (key) {
      const data = localStorage.getItem(key)
      if (data !== null) {
        return JSON.parse(data)
      }
      return null
    }
  }
}

export const locStorage = (isBrowser) ? createLocStorage() : {}

export const downloadText = (content, name, type = 'json') => {
  name = name || `download.${type}`
  const data = `data:text/${type};charset=utf-8,${encodeURIComponent(content)}`
  const el = document.createElement('a')
  el.setAttribute('href', data)
  el.setAttribute('download', name)
  el.click()
}

export const storageAvailable = (type) => {
  try {
    var storage = window[type]
    const x = '__storage_test__'
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
    const reader = new FileReader()
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
  const style = Object.entries(copyTextStyle).map(p => p.join(':')).join(';')
  attributes = attributes || { style }
  const value = targetNode.value || targetNode.innerText
  const el = targetNode.parentNode
  const ta = document.createElement('textarea')
  for (const att in attributes) {
    ta.setAttribute(att, attributes[att])
  }
  ta.value = value
  const node = el.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  el.removeChild(node)
}
