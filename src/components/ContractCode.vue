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
          data-item(type='externalLibraries' :data='libraries')

        //- Compilation settings
        template(v-if='verificationData')
          h3.subtitle Compilation settings
          data-item(:data='verificationData' type='compilationSettings')

      //-Consturctor Arguments
      template(v-if='constructorArgs')
        h3.subtitle Constructor Arguments
        data-item(:data='constructorArgs' type='constructorArguments')

      //- bytecode
      .section
        ctrl-big-text(v-if='code' :value='code' title='Bytecode' height='10em')

      //- Verify message
      .verify(v-if='!verification.result && contractVerifierEnabled')
        button.btn.big.btn-brand(@click='verifyContract') Verify Contract

</template>
<script>
import SourceCode from './SourceCode'
import CtrlBigText from './controls/CtrlBigText'
import CopyButton from './controls/CopyButton'
import DownloadButton from './controls/DownloadButton'
import DataItem from './DataItem'
import { ROUTES } from '../config/types'
import { mapGetters } from 'vuex'
export default {
  name: 'contract-code',
  components: {
    SourceCode,
    CtrlBigText,
    CopyButton,
    DownloadButton,
    DataItem
  },
  props: ['data'],
  data () {
    return {
      fileSelected: undefined
    }
  },
  created () {
    const first = this.imports[0]
    if (first) this.selectFile(first.name)
  },
  computed: {
    ...mapGetters(['contractVerifierEnabled']),
    verification () {
      return this.data.verification || {}
    },

    code () {
      return this.data.code
    },
    contractName () {
      const { name, address } = this.data
      return name || address
    },

    abi () {
      const { verification } = this
      const abi = (verification) ? verification.abi : null
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
      const sources = [...this.sources]
      return sources.splice(1)
    },

    request () {
      return this.verification.request
    },

    libraries () {
      return this.result.usedLibraries
    },

    verificationData () {
      const result = this.result || {}
      const { name: contractName, usedSettings } = result
      const { evmVersion, optimizer: optimization } = usedSettings
      const { version: compilerVersion } = usedSettings.compiler
      return { contractName, compilerVersion, evmVersion, optimization }
    },
    selected () {
      const { fileSelected } = this
      return this.imports.find(f => f.name === fileSelected)
    },
    constructorArgs () {
      const result = this.result || {}
      const { constructorArguments: decoded, encodedConstructorArguments: encoded } = result
      return (encoded || decoded) ? { encoded, decoded } : undefined
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
      font-weight 600
      border-bottom solid 1px $color

    button
      margin 0 0.5em
      font-weight 600

  .selected-file-enter-active, .selected-file-leave-active
    transition opacity 0.2s ease-in

  .selected-file-enter, .selected-file-leave-to
    opacity 0
</style>
