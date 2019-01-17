import entitiesDefs from '../../../config/entities'
import fieldsTypes from '../../../config/entities/lib/fieldsTypes'
import { EntityParser } from '../../../lib/js/EntityParser'
export const parser = new EntityParser(entitiesDefs, fieldsTypes)
const entities = parser.parse()
export default entities
