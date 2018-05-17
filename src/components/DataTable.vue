<template lang="pug">
  .data-table(v-if='data && fields')
    //- Table
    .table-ctrls
      button.switch(@click='switchTableGrid(false)' :disabled='!renderTable')
        icon(name='grid')
      button.switch(@click='switchTableGrid(true)' :disabled='renderTable')
        icon(name='table')
    table.dark(v-if='data' ref='table' :class='tableClass')
      thead(:class='theadClass')
        tr
          th.dummy
          template(v-for='field,fieldName,index in fields')
            template(v-if='!isHidden(fieldName)')
              th(:class='thClass(field.fieldName)') 
                .sort(v-if='sort && isSortable(field.fieldName)')
                  button.link(@click='sortBy(field.fieldName)')
                    field-title(:field='field')
                      .sort-icon(v-if='isSorted(field.fieldName) && !isDefaultSort')
                        icon.small(:name='sortIcon(field.fieldName)')
                  //-template(v-if='isSorted(field.fieldName) && sortKeys.length > 1')
                    small {{sortIndex(field.fieldName)}}
                template(v-else)
                  field-title(:field='field')
              th.dummy(v-if='isFrom(fieldName,index)' )
      tbody
        tr(v-for='row, rowIndex in dataFormatted' :class='rowClass(rowIndex)')
          td.row-icon
            router-link(:to='rowLink(row)')
              icon(:name='iconLoad' :style='iconStyle(row)')
          template(v-for='field,fieldName,index in fields') 
            td(v-if='!isHidden(fieldName)' :class='tdClass(fieldName)')
              template(v-if='!renderTable')
                .sort.td-title(v-if='sort && isSortable(field.fieldName)')
                  button.link(@click='sortBy(field.fieldName)')
                    field-title(:field='field')
                      .sort-icon(v-if='isSorted(field.fieldName) && !isDefaultSort')
                        icon.small(:name='sortIcon(field.fieldName)')
                field-title.td-title(v-else :field='field')
              data-field(:field='field' :row='row')  
            td.from-to-arrow(v-if='isFrom(fieldName,index)')
              icon(name='arrow-right')
</template>
<script>
import dataMixin from '../mixins/dataMixin'
import DataField from './DataField'
import FieldTitle from './FieldTitle'
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  name: 'data-table',
  components: {
    DataField,
    FieldTitle
  },
  mixins: [
    dataMixin
  ],
  props: [
    'data',
    'type',
    'action',
    'title',
    'hideFields',
    'link',
    'formatRow',
    'formatFields',
    'formatLink',
    'parentData',
    'sort'
  ],
  data () {
    return {
      renderTable: true,
      editSorts: false,
      sortChanged: false,
      sortDialog: {
        field: null,
        x: 0,
        y: 0
      }
    }
  },
  mounted () {
    let vm = this
    this.$nextTick(() => {
      let table = vm.$refs.table
      if (table && table.clientWidth > vm.$el.clientWidth) {
        vm.$set(this, 'renderTable', false)
      }
    })
  },
  computed: {
    ...mapGetters({ page: 'getPage' }),
    ...mapState({
      size: state => state.size
    }),
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
      return this.page.pages.defaultSort || {}
    },
    isDefaultSort () {
      let sortKeys = this.sortKeys
      let defSort = this.defaultSort
      let sort = this.sort
      if (sortKeys.length !== this.defKeys.length) return false
      return (undefined !== sortKeys.find(k => defSort[k] === sort[k]))
    },
    sortableFields () {
      let page = this.page
      let pages = page.pages
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
    }
  },
  methods: {
    ...mapActions(['updateRouterQuery']),
    sortIcon (fieldName) {
      let sort = this.sort[fieldName]
      let icon = 'triangle-arrow-'
      if (sort) {
        icon = (sort === -1) ? icon + 'down' : icon + 'up'
      }
      return icon
    },
    sortIndex (field) {
      return this.sortKeys.indexOf(field) + 1
    },
    removeSort (fieldName) {
      let sort = Object.assign({}, this.sort)
      delete sort[fieldName]
      this.getData(sort)
    },
    moveSort (field) {
      let keys = this.sortKeys
      let index = keys.indexOf(field)
      let to = (index === keys.length - 1) ? 0 : index + 1
      let sort = {}
      keys.splice(index, 1)
      keys.splice(to, 0, field)
      keys.forEach(k => { sort[k] = this.sort[k] })
      this.getData(sort)
    },
    getData (sort) {
      this.updateRouterQuery({ sort })
    },
    sortBy (field) {
      let sort = {}
      sort[field] = this.sort[field]
      if (!this.isDefaultSort) {
        if (sort[field] === -1) delete sort[field]
        else sort[field] = (sort[field]) ? -1 : 1
      } else {
        let defSort = this.defaultSort[field]
        sort[field] = -defSort
      }

      this.getData(sort)
    },
    isSorted (field) {
      let sort = this.sort
      return (sort && sort[field])
    },
    isSortable (field) {
      return (undefined !== this.sortableFields[field])
    },
    switchTableGrid (renderTable) {
      renderTable = renderTable || !this.renderTable
      this.renderTable = renderTable
    },
    thClass (field) {
      let css = []
      if (this.isSorted(field)) css.push('has-sort')
      if (!this.isSortable(field)) css.push('unsortable')
      return css
    },
    tdClass (name) {
      let css = [`field-${name}`]
      if (this.key === name) css.push('row-header')
      return css
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'

  .table-ctrls
    display flex
    justify-content flex-end

  .unsortable
    color gray

    .icon svg
      fill gray !important

  .sort
    flex-centered()

    .field-title
      flex-centered()

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
        fill $bg-color
        display flex

  sub
    color white

  .has-sort
    padding 0 !important
</style>
