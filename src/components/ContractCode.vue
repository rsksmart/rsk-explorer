<template lang="pug">
  .contract-details.section
      .section
        //- ABI
        ctrl-big-text(v-if='abi' :value='abi' :fileName='`${contractName}.json`' fileType='json' title='Contract ABI')
          source-code(lang='json' :code='abi')
      //- Verification
      .section(v-if='verification.result')
        h3.subtitle Contract Source

        //- Source
        ctrl-big-text(v-if='source' :value='source.contents' :fileName='source.name' fileType='sol' :title='source.name' )
          source-code(language='solidity' :code='source.contents')

        //-Dependencies
        template(v-if='imports.length')
          h3.subtitle Dependencies
          .files
            button.link(v-for='source in imports' @click.passive='selectFile(source.name)' :class='(source.name===fileSelected)?"sel":""')
              span {{source.name}}
          transition(name='selected-file' mode='out-in')
            ctrl-big-text(v-if='selected' :key='selected.name' :value='selected.contents' :fileName='selected.name' fileType='sol' :title='selected.name' )
              source-code(language='solidity' :code='selected.contents')

        //- Libraries
        template(v-if='libraries')
          h3.subtitle External Libraries
          .data-item
            .items.small
              .item(v-for='address,name,key in libraries' :class='(key %2) ? "odd": "even"')
                .field-title {{name}}
                .data-field
                  button.link(@click.passive='goTo(addressLink(address))')
                    span {{address}}

        //- Compilation settings
        template(v-if='verificationData')
         h3.subtitle Compilation settings
        .data-item
          .items.small
            .item(v-for='value,name,key in verificationData' :class='(key %2) ? "odd": "even"')
              .field-title {{ name | camel-case-to }}
              .data-field(v-if='value') {{  value }}

      //- bytecode
      .section
        ctrl-big-text(v-if='code' :value='code' title='Bytecode' height='10em')

      //- Verify message
      .verify(v-if='!verification.result')
        button.btn.big.btn-brand(@click='verifyContract') Verify Contract

</template>
<script>
import SourceCode from './SourceCode'
import CtrlBigText from './controls/CtrlBigText'
import CopyButton from './controls/CopyButton'
import DownloadButton from './controls/DownloadButton'
import { ROUTES } from '../config/types'
export default {
  name: 'contract-code',
  components: {
    SourceCode,
    CtrlBigText,
    CopyButton,
    DownloadButton
  },
  props: ['data'],
  data () {
    return {
      fileSelected: undefined
    }
  },
  created () {
    let first = this.imports[0]
    if (first) this.selectFile(first.name)
  },
  computed: {
    verification () {
      return this.data.verification || {}
    },

    code () {
      return this.data.code
    },
    contractName () {
      let { name, address } = this.data
      return name || address
    },

    abi () {
      let { verification } = this
      let abi = (verification) ? verification.abi : null
      return (abi) ? JSON.stringify(abi, null, 2) : null
    },

    result () {
      return this.verification.result
    },

    sources () {
      return this.verification.sources || []
    },

    source () {
      return this.sources[0]
    },

    imports () {
      let sources = [...this.sources]
      return sources.splice(1)
    },

    request () {
      return this.verification.request
    },

    libraries () {
      return this.result.usedLibraries
    },

    verificationData () {
      let result = this.result || {}
      let { name: contractName, usedSettings } = result
      let { evmVersion, optimizer: optimization } = usedSettings
      let { version: compilerVersion } = usedSettings.compiler
      return { contractName, compilerVersion, evmVersion, optimization }
    },

    selected () {
      let { fileSelected } = this
      return this.imports.find(f => f.name === fileSelected)
    }

  },
  methods: {
    verifyContract () {
      const { address } = this.data
      const path = `/${ROUTES.verifyContract}/${address}`
      this.$router.push({ path })
    },

    selectFile (fileName) {
      this.fileSelected = fileName
    },
    addressLink (address) {
      return `/${ROUTES.address}/${address}`
    },
    goTo (link) {
      this.$router.push(link)
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .contract-details
    .verify
      display block
      margin 1em
      width 100%
      text-align right

    .files
      display flex
      flex-flow row wrap
      position relative
      min-width 100%
      width 100%
      justify-content flex-start

      .sel
        font-weight bold
        border-bottom solid 1px $color

      button
        margin 0 0.5em
        font-weight bold

    .selected-file-enter-active, .selected-file-leave-active
      transition opacity 0.2s ease-in

    .selected-file-enter, .selected-file-leave-to
      opacity 0
</style>
