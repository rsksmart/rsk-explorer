<template>
  <div class="data-table" v-if="data.length && fields">
    <!-- Table Controls -->
    <div class="table-ctrls">
      <button class="text-white-100 bg-secondary btn" @click="switchExportMenu">
        <icon :name="icons.download"></icon>
        <span class="text">Download</span>
        <icon :name="!showExportMenu ? 'arrow-down' : 'arrow-up'"></icon>
      </button>
    </div>
    <!-- Export Menu -->
    <div class="export-menu row" v-if="showExportMenu">
      <export-pages v-if="exportParams" v-bind="exportParams" @close="switchExportMenu"></export-pages>
    </div>
    <table class="" v-if="data" ref="table" :class="[tableClass, `d-${exportParams.entityName || ''}`]">
      <thead :class="theadClass">
        <tr>
          <th class="table-id" v-if="sort && !isDefaultSortVisible">
            <div class="sort" v-if="sort && isSorted([defKeys[0]])">
            </div>
            <template v-else>
              <div class="field-title">
                <button class="link" @click="sortBy(defKeys[0], $event)">
                  <icon :name="iconLoad" :style="iconStyle()"></icon>
                </button>
              </div>
            </template>
          </th>
          <th class="dummy" v-else></th>
          <template v-for="(field, fieldName, index) in fields">
            <template v-if="!isHidden(fieldName)">
              <th :class="thClass(field.fieldName)" :key="`1-${index}`">
                <div class="sort" v-if="sort && isSortable(field.path)">
                  {{ field.title }}
                </div>
                <template v-else>
                  {{ field.title }}
                </template>
              </th>
            </template>
            <th class="dummy" v-if="isFrom(fieldName, index)" :key="`2-${index}`"></th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in dataFormatted" :class="rowClass(rowIndex)" :key="`3-${rowIndex}`">
          <!-- Row Icon -->
          <td class="row-icon">
            <router-link :to="rowLink(row)">
              <icon-svg :name="iconLoad" />
            </router-link>
            <!-- Grid Default Sort Icon -->
            <template v-if="!renderTable">
              <div class="sort td-title" v-if="sort && isSorted([defKeys[0]])">
                <button class="link" @click="sortBy(defKeys[0], $event)">
                  <div class="sort-icon" v-if="isSorted(defKeys[0])">
                    <icon small :name="sortIcon(defKeys[0])"></icon>
                  </div>
                </button>
              </div>
            </template>
          </td>
          <template v-for="(field, fieldName, index) in fields">
            <td v-if="!isHidden(fieldName)" :class="tdClass(fieldName)" :key="`4-${index}`">
              <template v-if="!renderTable">
                <div class="sort td-title" v-if="sort && isSortable(field.path)">
                  <button class="link" @click="sortBy(field.path, $event)">
                    <field-title :field="field">
                      <div class="sort-icon" v-if="isSorted(field.path) && !isDefaultSort">
                        <icon small :name="sortIcon(field.path)"></icon>
                      </div>
                    </field-title>
                  </button>
                </div>
                <field-title class="td-title" v-else :field="field"></field-title>
              </template>
              <template v-if="getCustomRenderProps(field, row)">
                <component :is="field.renderAs" v-bind="getCustomRenderProps(field, row)"></component>
              </template>
              <data-field :fieldClassName="tdClass(fieldName)" v-else :field="field" :row="row" />
            </td>
            <td class="from-to-arrow" v-if="isFrom(fieldName, index)" :key="`5-${index}`">
              <icon name="arrow-right"></icon>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import dataMixin from '@/mixins/dataMixin'
import DataField from '@/components/DataField'
import FieldTitle from '@/components/FieldTitle'
import MenuButton from '@/components/controls/MenuButton'
import ExportPages from '@/components/ExportPages'
import icons from '@/config/icons'
import { mapGetters, mapActions, mapState } from 'vuex'
import RenderField from './RenderField.vue'
import IconSvg from './IconSvg.vue'
export default {
  name: 'data-table',
  components: {
    DataField,
    FieldTitle,
    MenuButton,
    ExportPages,
    RenderField,
    IconSvg
  },
  mixins: [
    dataMixin
  ],
  props: [
    'tableName',
    'type',
    'action',
    'title',
    'hideFields',
    'link',
    'formatRow',
    'formatFields',
    'formatLink',
    'parentData',
    'sort',
    'page'
  ],
  data () {
    return {
      editSorts: false,
      sortChanged: false,
      showExportMenu: false,
      sortDialog: {
        field: null,
        x: 0,
        y: 0
      },
      icons
    }
  },
  mounted () {
    const vm = this
    const table = this.$refs.table
    const tw = this.tableConfig.w
    const size = this.size
    const parent = vm.$parent.$el
    this.$nextTick(() => {
      if (table) {
        const tcw = table.clientWidth
        if (table && (tcw > size.w || tcw > parent.clientWidth)) {
          if (!tw || size.w < tw) {
            vm.$set(vm, 'renderTable', false)
          }
        }
      }
    })
  },
  computed: {
    ...mapState({
      size: state => state.size
    }),
    renderTable: {
      get () {
        const r = this.tableConfig.renderTable
        return (undefined === r) ? true : r
      },
      set (renderTable) {
        this.updateTableConfig([this.tableId, { renderTable }])
      }
    },
    data () {
      return this.page.data
    },
    requestedPage () {
      return this.page.req
    },
    sortKeys () {
      if (!this.sort) return null
      return Object.keys(this.sort)
    },
    defKeys () {
      return Object.keys(this.defaultSort)
    },
    defaultSort () {
      const { page } = this
      const pages = page.pages || {}
      return pages.defaultSort || { _id: -1 }
    },
    isDefaultSort () {
      const sortKeys = this.sortKeys
      const defSort = this.defaultSort
      const sort = this.sort
      if (sortKeys.length !== this.defKeys.length) return false
      return (undefined !== sortKeys.find(k => defSort[k] === sort[k]))
    },
    isDefaultSortVisible () {
      const fields = Object.values(this.fields).map(f => f.path)
      const keys = this.defKeys.map(k => fields.includes(k))
      return keys.reduce((v, a) => v && a)
    },
    sortableFields () {
      const page = this.page
      const pages = page.pages
      return (pages && pages.sortable) ? pages.sortable : {}
    },
    hasSorts () {
      if (!this.sortKeys) return false
      return this.sortKeys.length > 1
    },
    tableClass () {
      return (!this.renderTable) ? 'flex-table' : ''
    },
    theadClass () {
      return (this.showSort && !this.renderTable) ? 'show' : ''
    },
    tableId () {
      return this.getTableId()(this.tableName)
    },
    tableConfig () {
      return this.getTableConfig()(this.tableId)
    },
    key () {
      const page = this.page
      const req = (page) ? page.req : {}
      return (req) ? req.key : null
    },
    exportParams () {
      const { page, type, key, parentData, entity } = this
      const { itemEntity } = entity
      if (!page || !page.req || !type || !key) return { entityName: '' }
      const req = Object.assign({ entityName: type, dataKey: key, parentData, itemEntity }, page.req)
      return req
    }
  },
  methods: {
    ...mapActions([
      'updateRouterQuery',
      'updateTableConfig'
    ]),
    ...mapGetters([
      'getTableId',
      'getTableConfig',
      'removePaginationFromRoute',
      'sortKey'
    ]),
    sortIcon (fieldName) {
      const sort = this.sort[fieldName]
      let icon = 'triangle-arrow-'
      if (sort) {
        icon = (sort === -1) ? icon + 'down' : icon + 'up'
      }
      return icon
    },
    sortIndex (field) {
      return this.sortKeys.indexOf(field) + 1
    },
    getData (sort, hash) {
      const key = this.key
      const sortKey = this.sortKey()(key)
      const query = this.removePaginationFromRoute()(key, { [sortKey]: sort })
      this.updateRouterQuery({ query, hash, key })
    },
    sortBy (field, event) {
      const hash = this.getRouterHashFromEvent(event)
      const sort = {}
      sort[field] = this.sort[field]
      if (!this.isDefaultSort) {
        if (sort[field] === -1) delete sort[field]
        else sort[field] = (sort[field]) ? -1 : 1
      } else {
        sort[field] = (sort[field] === 1) ? -1 : 1
      }
      this.getData(sort, hash)
    },
    isSorted (field) {
      const sort = this.sort
      const sorted = (sort && sort[field])
      return sorted
    },
    isSortable (field) {
      return (undefined !== this.sortableFields[field])
    },
    switchTableGrid (renderTable) {
      renderTable = renderTable || !this.renderTable
      this.renderTable = renderTable
    },
    thClass (field) {
      const css = []
      if (this.isSorted(field)) css.push('has-sort')
      if (!this.isSortable(field)) css.push('unsortable')
      return css
    },
    tdClass (name) {
      const css = [`field__${name}`]
      if (this.key === name) css.push('row-header')
      return css
    },
    switchExportMenu () {
      this.showExportMenu = !this.showExportMenu
    }
  }
}
</script>
<style lang="stylus">
  .data-page
    position: relative

  .table-ctrls
    top 0px
    right 24px
    position absolute
    justify-content flex-end

  .unsortable > .field-title

    .icon svg
      fill gray !important

  .sort

    button
      display flex

    div
      display flex

    .icon
      margin 0 0.5em 0 0

    .sort-icon
      margin 0 0.25em
      display flex
      justify-content center
      align-items center
      background $color
      width 1em
      height @width
      border-radius 50%

      svg.svg-icon *
        fill $bg-color !important
        display flex

  sub

  .has-sort
    padding 0 !important
</style>
