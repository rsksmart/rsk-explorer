import Vue from 'vue'

export const dataEntity = state => dataType => {
  if (dataType) return state.dataEntities[dataType]
}

export const dataFields = state => {
  return state.fields
}

export const dataKey = state => type => {
  let entity = state.dataEntities[type]
  if (entity) return entity.key
}

export const dataKeyValue = (state, getters) => (type, data) => {
  let key = getters.dataKey(type)
  if (key) {
    key = key.split('.')
    return getters.getFieldValue(key, data)
  }
}

export const getFieldFilteredValue = (state, getters) => (field, data, raw) => {
  if (field.field) {
    let value = getters.getFieldValue(field.field, data)
    if (value && !raw) {
      value = getters.filterFieldValue(field, value)
    }
    return value
  }
}

export const filterFieldValue = (state, getters) => (field, value) => {
  let type = field.type
  let now = getters.getDate
  if (type === 'timestamp' && value) value = now - value * 1000
  let filters = field.filters
  if (filters) {
    value = getters.applyFilters(filters, value)
  }
  return value
}

export const getFieldValue = state => (field, data) => {
  if (field) {
    let value = data
    for (let f of field) {
      value = (value && value[f]) ? value[f] : null
    }
    return value
  }
}

export const applyFilters = state => (filters, value) => {
  if (filters) {
    filters = Array.isArray(filters) ? filters : [filters]
    for (let f of filters) {
      if (typeof f === 'object') {
        let filterName = f.name
        let args = f.args
        if (filterName) value = filter(filterName, value, args)
      } else {
        value = filter(f, value)
      }
    }
  }
  return value
}

const filter = (filterName, value, args) => {
  let filter = Vue.filter(filterName)
  args = args || []
  args = Array.isArray(args) ? args : [args]
  if (filter) {
    value = filter(value, ...args)
  } else {
    console.info('Unknown filter ' + filterName)
  }
  return value
}
