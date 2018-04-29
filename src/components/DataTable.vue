<template lang="pug">
  .data-table(v-if='data && fields' @click.passive='resetControls')
    //- Table sorts
    button.btn.bg-brand(v-if='!editSorts && hasSorts' @click='editSorts=true') Edit sort fields
    //- sort editor
    .sorts-ctrl.frame(v-if='showSorts') 
      span Table sorts:
      template(v-if='hasSorts' v-for='i,fieldName in sortFields')
          drop-area(
            @drop='changeSort($event,fieldName)' 
            :class='(sortDialog.field) ? "active" : "hidden"')
            .pill(v-if='sortDialog.field !== fieldName')
              button(@click.stop='showSortDialog(fieldName,$event)')
                icon(name='move')
              field-title(:field='fieldFromKey(fieldName)' :options='{forceTitle:true}')
              button.clear(@click='sortRemove(fieldName)')
                icon(name="delete-forever")
          //- Field dialog
          template(v-if='sortDialog.field === fieldName')
            dialog-drag.dialog-pill(:id='fieldName' :options='sortDialogOptions()' @close='showSortDialog()')
              template(slot='title')
                field-title(:field='fieldFromKey(fieldName)')
              //-template(slot='button-close')
                icon( name='close')
      //- Sort editor  buttons
      button.big.info(v-if='sortChanged' @click='applySorts')
        icon(name='check')
      button.big.brand(@click='discardSorts')
        icon(name='close') 
    //- Table
    table.dark(v-if='data')
      thead
        tr
          th
          template(v-for='field,fieldName,index in fields')
            template(v-if='!isHidden(fieldName)')
              th(:class='thClass(field.fieldName)') 
                template(v-if='sort') 
                  button(@click='sort && sortBy(field.fieldName)')
                    icon(v-if='field.titleIcon && field.icon' :name='field.icon')
                    span(v-if='!field.hideTitle') {{ field.title }}
                    .sort(v-if='isSorted(field.fieldName)')
                      .icon
                        icon.small(:name='sortIcon(field.fieldName)')
                      sub {{sortIndex(field.fieldName)}}
                template(v-else)
                  field-title(:field='field')

              th(v-if='isFrom(fieldName,index)' )
      tbody
        tr(v-for='row, rowIndex in dataFormatted' :class='rowClass(rowIndex)')
          td
            router-link(:to='rowLink(row)')
              icon(:name='iconLoad' :style='iconStyle(row)')
          template(v-for='field,fieldName,index in fields') 
            td(v-if='!isHidden(fieldName)')
              data-field(:field='field' :row='row')  
            td(v-if='isFrom(fieldName,index)')
              icon(name='arrow-right')
</template>
<script>
import dataMixin from '../mixins/dataMixin'
import DataField from './DataField'
import FieldTitle from './FieldTitle'
import { mapGetters, mapActions } from 'vuex'
import DialogDrag from 'vue-dialog-drag'
import DropArea from 'vue-dialog-drag/dist/drop-area'
export default {
  name: 'data-table',
  components: {
    DataField,
    FieldTitle,
    DialogDrag,
    DropArea
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
      sortFields: {
        isNEW: true
      },
      editSorts: false,
      sortChanged: false,
      sortDialog: {
        field: null,
        x: 0,
        y: 0
      }
    }
  },
  created () {
    this.resetSorts()
  },
  watch: {
    sortFields (newValue, oldValue) {
      if (oldValue.isNEW) return
      this.sortChanged = this.isChanged(oldValue, newValue)
    }
  },
  computed: {
    ...mapGetters({ req: 'requestedPage' }),
    sortKeys () {
      if (!this.sort) return null
      return Object.keys(this.sort)
    },
    hasSorts () {
      if (!this.sortKeys) return false
      return this.sortKeys.length > 1
    },
    showSorts () {
      return this.hasSorts && this.editSorts
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
    isChanged (oa, ob) {
      let oak = Object.keys(oa)
      let obk = Object.keys(ob)
      if (oak.length !== obk.length) return true
      for (let k in oak) {
        if (oak[k] !== obk[k]) return true
      }
      for (let p in oa) {
        if (oa[p] !== ob[p]) return true
      }
      return false
    },
    sortIndex (field) {
      return this.sortKeys.indexOf(field) + 1
    },
    resetControls () {
      this.closeSortDialog()
    },
    closeSortDialog () {
      if (this.sortDialog.field) {
        this.sortDialog.field = null
      }
    },
    changeSort (from, to) {
      let keys = Object.assign([], this.sortKeys)
      let fromKey = keys.indexOf(from)
      let toKey = keys.indexOf(to)
      keys.splice(fromKey, 1)
      keys.splice(toKey, 0, from)
      let newSort = {}
      keys.forEach((k) => { newSort[k] = this.sortFields[k] })
      this.sortFields = newSort
      this.closeSortDialog()
    },
    showSortOrder (field) {
      this.sortOrderMenu = field
    },
    sortDialogOptions (opts) {
      let y = this.sortDialog.y
      let x = this.sortDialog.x
      return {
        buttonPin: false,
        x,
        y
      }
    },
    showSortDialog (field, event) {
      let keys = Object.keys(this.sortFields)
      if (keys.length > 2) {
        let x = 0
        let y = 0
        if (event) {
          x = event.pageX
          y = event.pageY
        }
        this.sortDialog = { field, x, y }
      } else { // if 2 fields: switch
        let newSort = {}
        keys.reverse()
          .forEach(v => { newSort[v] = this.sortFields[v] })
        this.sortFields = newSort
      }
    },
    applySorts () {
      this.getData(this.sortFields)
    },
    resetSorts () {
      this.sortFields = Object.assign({}, this.sort)
    },
    discardSorts () {
      this.resetSorts()
      this.editSorts = false
    },
    getData (sort) {
      this.updateRouterQuery({ sort })
    },
    sortBy (field) {
      let sort = this.sort
      sort[field] = (sort[field] || -1) * -1
      this.getData(sort)
    },
    sortRemove (field) {
      this.$delete(this.sortFields, field)
    },
    isSorted (field) {
      let sort = this.sort
      return (sort && sort[field])
    },
    thClass (field) {
      return (this.isSorted(field)) ? 'has-sort' : ''
    }

  }
}
</script>
<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'

  .dialog-drag.dialog-pill
    font-size 14px
    pill()

    .dialog-body
      display none

    .dialog-header
      padding-top 0
      padding-bottom 0

    button.close
      .title *
        font-size 1 em

    .dialog-header, .dialog-header .title
      border none
      margin 0
      background none

      & *
        color white

  .sorts-ctrl
    margin 1em
    display flex
    flex-centered()

  .sort-order-menu
    list-style none
    display inline-flex
    flex-flow column nowrap
    position absolute
    bottom 1em
    margin 0 0 0 1em
    padding 0

    li
      font-size 0.9em
      width 2em

      button:hover
        padding 0 0.125em
        borders()
        color white

      &:hover
        background $quasi-bg
        color white

    li.selected
      button
        color white
        font-weight bold

  .sort
    margin 0 0 0 0.5em
    display inline-flex

    .icon
      display flex
      justify-content center
      align-items center
      background $color
      width 1em
      height @width
      border-radius 50%

    svg.svg-icon *
      fill white
      display flex

  sub
    color white

  .has-sort
    color inherit
    padding 0 !important
    position relative

  .drop-area
    min-width 4em
    min-height 1.5em
    margin 0

    .over
      border-style solid
      border-color color2
      border-width 0 10px 0 0

  .drop-area:first-child
    .over
      border-width 0 0 0 10px

  .drop-area.active
    border-width 1px

  .drop-area.hidden
    border-width 0
</style>
