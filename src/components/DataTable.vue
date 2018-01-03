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
              icon(:name='iconLoad')
          template(v-for='field,fieldName,index in fields') 
            td(v-if='!isHidden(fieldName)')
              template(v-if='field.link && getValue(field,row)') 
                router-link(:to='field.link + getValue(field,row)' :style='cellStyle(field,getValue(field,row))')
                  data-field(:field='field' :value='getValue(field,row)')
              template(v-else)
                data-field(:field='field' :value='getValue(field,row)' :style='cellStyle(field,getValue(field,row))')  
            td(v-if='isFrom(fieldName,index)')
              icon(name='arrow-right')


</template>
<script>
import dataMixin from '../mixins/dataMixin'
export default {
  name: 'data-table',
  mixins: [
    dataMixin
  ]
}
</script>
