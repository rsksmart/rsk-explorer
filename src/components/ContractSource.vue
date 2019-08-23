<template lang="pug">
  .contract-source.section
    .source.row(v-if='source')
      .files.col
        ul.plain.file-list
          li.file(v-for='code,fileName in imports' :class='(fileSelected === fileName) ? ["bold"]:[]')
            //-icon(name='solidity')
            small.link(@click.passive='selectFile(fileName)') {{fileName}}
      .source.col
        source-code(v-if='source' :code='source' :language='"solidity"')

</template>
<script>
import SourceCode from './SourceCode'
export default {
  name: 'contract-source',
  components: { SourceCode },
  props: ['data'],
  data () {
    return {
      fileSelected: undefined
    }
  },
  created () {
    let imports = this.imports || {}
    let first = Object.keys(imports)[0]
    if (first) {
      this.selectFile(first)
    }
  },
  computed: {
    verification () {
      const { verification } = this.data || {}
      return verification || {}
    },

    imports () {
      let imports = this.verification.sources || []
      return imports.reduce((v, a, i) => {
        v[a.name] = a.contents
        return v
      }, {})
    },

    source () {
      return this.imports[this.fileSelected]
    }

  },
  methods: {
    selectFile (fileName) {
      this.fileSelected = fileName
    }
  }
}
</script>
<style lang="stylus">
  .contract-source
    flex-flow row wrap
    display flex
    align-items flex-start

    .files
      display flex
      flex 0 0 5em
      align-self flex-start

    .file-list
      margin 1em

    .source
      flex 1 1 80%
</style>
