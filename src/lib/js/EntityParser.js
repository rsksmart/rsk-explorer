export class EntityParser {
  constructor (entities, fields) {
    this.entities = entities
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
    for (let f in entity.fields) {
      let field = entity.fields[f] || {}
      entity.fields[f] = this.parseField(f, field)
    }
    return entity
  }
  defValue (field, keys, def) {
    for (let key of keys) {
      field[key] = field[key] || def[key]
    }
    return field
  }

  parseField (name, field) {
    field.name = name
    field.field = field.field || name
    field.field = field.field.split('.')
    field.type = field.type || name
    field.filters = field.filters || null
    field.titleIcon = field.titleIcon || false
    field.hideTitle = field.hideTitle || false
    field.title = field.title || name
    let fieldDef = this.fields[field.type]
    if (fieldDef) {
      if (fieldDef.filters) {
        let filters = field.filters || []
        field.filters = filters.concat(fieldDef.filters)
      }
      field = this.defValue(
        field,
        ['titleIcon', 'hideTitle', 'icon', 'link'],
        fieldDef
      )
    }
    return field
  }
}

export default EntityParser
