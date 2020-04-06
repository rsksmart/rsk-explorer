<template lang="pug">
  .files-ctrl
    input(type='file' @change='addFiles' :multiple='multiple' ref='filesInput' class='files-input' :accept='accept')
    button.btn.brand(v-if='multiple || !files.length' @click.prevent='clickFile')
      icon.white(name='document-add')
      span(v-if='buttonText') {{buttonText}}
      template(v-else)
        span(v-if='multiple') Add files
        span(v-else) Add file
    .row
        ul.files(v-if='files.length')
          li.file(v-for='file,key in files')
            span.file-name {{file.name}}
            button(type="button" @click.passive='removeFile(file.name)')
              icon(name='close')
        //- table.dark.files-table(v-if='files.length')
          tr(v-for='file,key in files' :class='(key % 2 ) ? "odd" : "even"' )
            td.file-name {{file.name}}
            td
              button(type="button" @click.passive='removeFile(file.name)')
                icon(name='close')
</template>
<script>
import { readTextFile } from '../../lib/js/io'
export default {
  name: 'ctrl-files',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    loadFiles: {
      type: Array
    },
    accept: {
      type: String
    },
    buttonText: {
      type: String
    }
  },
  data () {
    return {
      files: [],
      errors: []
    }
  },
  created () {
    const { loadFiles } = this
    if (loadFiles) {
      this.files = [...loadFiles]
    }
  },
  methods: {
    clickFile () {
      const ctrl = this.$refs.filesInput
      ctrl.click()
    },
    async addFiles (event) {
      try {
        const { target } = event
        const files = [...target.files]
        target.value = null
        for (const file of files) {
          const { name } = file
          const contents = await readTextFile(file)
          if (contents) {
            if (this.findFileKey(name) < 0) {
              const file = { name, contents }
              if (this.multiple) this.files.push(file)
              else this.files = [file]
              this.emitChange()
            }
          }
        }
      } catch (err) {
        this.$emit('error', err)
      }
    },

    findFileKey (fileName, files) {
      files = files || this.files
      return files.findIndex(f => f.name === fileName)
    },

    removeFile (fileName) {
      const files = [...this.files]
      const key = this.findFileKey(fileName, files)
      if (key > -1) files.splice(key, 1)
      this.files = files
      this.emitChange()
    },
    emitChange () {
      const files = [...this.files]
      this.$emit('change', files)
    }
  }
}
</script>
<style lang="stylus">
  .files-ctrl
    box-sizing content-box
    min-width 100%

    .files-input
      display none

  ul.files
    list-style none
    padding 0
    display flex
    flex-flow row wrap
    margin 1em 0 0 0

    li.file
      font-size 0.85em
      display flex
      flex 1
      display flex
      flex-flow row nowrap
      align-items center
      margin 0 0.5em

      button
        vertical-align middle
        height auto
        margin 0 0.5em

      .file-name
        margin 0 0 0 0.5em
</style>
