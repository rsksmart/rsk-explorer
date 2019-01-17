import { AUTO_FIELD } from '../../config/types'

export class EntityParser {
  constructor (entities, fields) {
    this.entities = entities
    this.fieldsTypes = fields
  }
  setFields (fields) {
    this.fields = fields
  }
  parse () {
    let res = {}
    for (let name in this.entities) {
      res[name] = this.parseEntity(name, this.entities[name])
    }
    return res
  }
  parseEntity (name, entity) {
    entity.fields = entity.fields || {}
    entity.fieldsKeys = {}
    for (let f in entity.fields) {
      let field = entity.fields[f] || {}
      let parsedField = this.parseField(f, field)
      entity.fields[f] = parsedField
      entity.fieldsKeys[parsedField.field] = f
    }
    return entity
  }

  parseField (name, field) {
    return parseField(name, field, this.fieldsTypes)
  }
}

export const defValue = (field, keys, def) => {
  for (let key of keys) {
    field[key] = field[key] || def[key]
  }
  return field
}

export const parseField = (name, field, fieldsTypes) => {
  field.name = name
  field.field = field.field || name
  field.path = field.field
  if (!Array.isArray(field.field)) {
    field.field = field.field.split('.')
  }
  field.fieldName = field.field[0] || null
  field.type = field.type || name
  field.filters = field.filters || null
  field.titleIcon = field.titleIcon || false
  field.hideTitle = field.hideTitle || false
  field.title = field.title || name
  let fieldDef = fieldsTypes[field.type]
  if (fieldDef) {
    if (fieldDef.filters) {
      let filters = field.filters || []
      field.filters = filters.concat(fieldDef.filters)
    }
    field = defValue(
      field,
      ['titleIcon', 'hideTitle', 'icon', 'link', 'default', 'css', 'trim'],
      fieldDef
    )
  }
  field.__parsed = true
  field[AUTO_FIELD] = field[AUTO_FIELD] || false
  return field
}

export default EntityParser
