<template lang="pug">
  .data-table(v-if='data && fields')
    table.dark(v-if='data')
      thead
        tr
          th
          template(v-for='field,fieldName,index in fields')
            template(v-if='!isHidden(fieldName)')
              th  
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
export default {
  name: 'data-table',
  props: [
    'data',
    'type',
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
  ]
}
</script>
