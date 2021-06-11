import Vue from 'vue'

export const dataEntity = state => dataType => {
  if (dataType) return state.entities[dataType]
}

export const dataFields = state => {
  return state.fields
}

export const dataKey = state => type => {
  const entity = state.entities[type]
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
  if (field && field.field) {
    let value = getters.getFieldValue(field.field, data)
    if (value && !raw) {
      value = getters.filterFieldValue({ field, value, data })
    }
    return value
  }
}

export const filterFieldValue = (state, getters) => ({ field, value, data, context } = {}) => {
  field = field || {}
  const { filters } = field
  return filters ? getters.applyFilters({ filters, value, data, context }) : value
}

export const getFieldValue = state => (field, data) => {
  if (field) {
    let value = data
    for (const f of field) {
      value = (value && (value[f] || value[f] === 0)) ? value[f] : null
    }
    return value
  }
}

export const applyFilters = state => ({ filters, value, data, context } = {}) => {
  if (filters) {
    filters = Array.isArray(filters) ? filters : [filters]
    for (const f of filters) {
      if (typeof f === 'function') {
        value = f(value, data, context)
      } else {
        value = applyFilter(f, value)
      }
    }
  }
  return value
}

const applyFilter = (filterName, value, args) => {
  const filter = Vue.filter(filterName)
  args = args || []
  args = Array.isArray(args) ? args : [args]
  if (filter) {
    value = filter(value, ...args)
  } else {
    // console.info('Unknown filter ' + filterName)
  }
  return value
}
