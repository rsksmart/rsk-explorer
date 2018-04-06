<template lang="pug">
  .data-table(v-if='data && fields')
    //-.sorts-ctrl(v-if='sort')
      ul.inline(v-for='i,fieldName in sort')
        li
          .pill
            small {{fieldName}}
            button.clear(@click='sortRemove(fieldName)')
              icon(name="delete")

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
                      sub(v-if='sorts > 1') {{sortIndex[field.fieldName]}} 
                  button.sort(v-if='sort && sort[field.fieldName]' @click='sortRemove(field.fieldName)') x
                template(v-else)
                  icon(v-if='field.titleIcon && field.icon' :name='field.icon')
                  span(v-if='!field.hideTitle') {{ field.title }}

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
import DataField from '../components/DataField'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'data-table',
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
  components: { DataField },
  mixins: [
    dataMixin
  ],
  computed: {
    ...mapGetters({ req: 'requestedPage' }),
    sorts () {
      return Object.keys(this.sort).length
    },
    sortIndex () {
      let index = {}
      Object.keys(this.sort).forEach((v, i) => {
        index[v] = i + 1
      })
      return index
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
    getData (sort) {
      this.updateRouterQuery({ sort })
    },
    sortBy (field) {
      console.log('sort')
      let sort = this.sort
      sort[field] = (sort[field] || -1) * -1
      // this.$router.push({ query: JSON.stringify(sort) })
      this.getData(sort)
    },
    sortRemove (field) {
      let sort = Object.assign({}, this.sort)
      delete (sort[field])
      this.getData(sort)
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
<style lang="stylus">
  @import '../lib/styl/vars.styl'

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
    color red
</style>
