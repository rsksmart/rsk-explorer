import entities from '../../../config/dataEntities'
import fieldsTypes from '../../../config/fieldsTypes'
import { EntityParser } from '../../../lib/js/EntityParser'
const parser = new EntityParser(entities, fieldsTypes)
const dataEntities = parser.parse()
export default function () {
  return {
    dataEntities
  }
}
