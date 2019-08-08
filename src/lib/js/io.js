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

export const downloadJSON = (json, name) => {
  name = name || 'download'
  name += '.json'
  let data = 'data:text/json;charset=utf-8,' + encodeURIComponent(json)
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
