<template lang="pug">
  .contract-details.section
    .section
      .verify(v-if='!verification.result')
        a.btn.btn-brand(@click='verifyContract') Verify Contract
      ctrl-big-text(v-if='code' :value='code' title='Bytecode' height='10em')
      ctrl-big-text(v-if='abi' :value='abi' fileName='abi.json' fileType='json' title='Contract ABI')
        highlight-code(lang='json' :code='abi')
      template(v-if='sources.length')
        //-h3.subtitle Contract Source
        template(v-if='verificationData')
         h4.subtitle Compilation settings
          .data-item
            .items.small
              .item(v-for='value,name,key in verificationData' :class='(key %2) ? "odd": "even"')
                .field-title {{name| camel-case-to }}
                .data-field(v-if='value') {{  value }}
        template(v-if='libraries.length')
          h4.subtitle External Libraries
          .data-item
            .items.small
              .item(v-for='address,name,key in libraries' :class='(key %2) ? "odd": "even"')
                .field-title {{name}}
                .data-field
                  a(:href='addressLink(address)') {{address}}
        template(v-for='source in sources')
          ctrl-big-text(v-if='source' :value='source.contents' :fileName='source.name' fileType='sol' :title='source.name' )
            source-code(language='solidity' :code='source.contents')
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
  computed: {
    verification () {
      return this.data.verification || {}
    },

    code () {
      return this.data.code
    },

    abi () {
      let { verification } = this
      let abi = (verification) ? verification.abi : null
      return (abi) ? JSON.stringify(abi, null, 2) : null
    },

    sources () {
      return this.verification.sources || []
    },

    request () {
      return this.verification.request
    },

    libraries () {
      return this.request.libraries
    },

    verificationData () {
      let request = this.request || {}
      let { name, settings, version } = request
      let { evmVersion, optimizer } = settings
      return { contractName: name, compilerVersion: version, evmVersion, optimizerEnabled: optimizer.enabled }
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
      return `${ROUTES.address}/${address}`
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .contract-details
    .ctrl-big-text
      margin 2em 0 0 0

    .files
      position relative
      min-width 100%
      width 100%
      justify-content flex-start

      .sel
        font-weight bold
        border-bottom solid 1px $color

      button
        margin 0 1em
        font-weight bold
</style>
