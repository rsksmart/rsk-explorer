import entities from '../../../config/entities'
import fieldsTypes from '../../../config/entities/lib/fieldsTypes'
import { EntityParser } from '../../../lib/js/EntityParser'
const parser = new EntityParser(entities, fieldsTypes)
const dataEntities = parser.parse()
export default function () {
  return {
    dataEntities
  }
}
