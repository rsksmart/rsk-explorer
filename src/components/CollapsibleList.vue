<template lang="pug">
  .collapsible-list
    template(v-if='(!data || !data.length) && emptyMsg')
      .txt-center
        small {{emptyMsg}}
    template(v-else)
      collapsible-container.element(v-for='item,key in data' :key='key' :expanded='data.length === 1'
        :class='(key % 2) ? "odd" : "even"')
        .row(v-if='header' slot='header')
          .col(v-for='txt in headerContent(item)') {{txt}}
        data-item(:data='item' :key='key' :type='type')

</template>
<script>
import DataMixin from '../mixins/dataMixin'
import CollapsibleContainer from './CollapsibleContainer'
export default {
  name: 'collapsible-list',
  props: ['data', 'type', 'header','emptyMsg'],
  mixins: [DataMixin],
  components: {
    CollapsibleContainer
  },
  methods: {
    headerContent (data) {
      let header = this.header
      header = (typeof header === 'function') ? header(data) : header
      return header || []
    }
  }
}
</script>
<style lang="stylus">
  .collapsible-list
    .element
      margin 0.5em
</style>
