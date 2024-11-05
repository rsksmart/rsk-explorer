<template>
  <div class="contract-details section">
    <div class="section">
      <!-- ABI -->
      <ctrl-big-text v-if="abi" :value="abi" :fileName="`${contractName}.json`" fileType="json" title="Contract ABI">
        <source-code lang="json" :code="abi"></source-code>
      </ctrl-big-text>
    </div>

    <!-- Verification -->
    <div class="section" v-if="verification.result">
      <h3 class="subtitle">Contract Source</h3>

      <!-- Source -->
      <ctrl-big-text v-if="source" :value="source.contents" :fileName="source.name" fileType="sol" :title="source.name" :remixLink="remixLink">
        <source-code language="solidity" :code="source.contents"></source-code>
      </ctrl-big-text>

      <!-- Dependencies -->
      <template v-if="imports.length">
        <h3 class="subtitle">Dependencies</h3>
        <div class="files">
          <button class="link" v-for="(source, i) in imports" :key="i"  @click.passive="selectFile(source.name)" :class="(source.name === fileSelected) ? 'sel' : ''">
            <span>{{ source.name }}</span>
          </button>
        </div>
        <transition name="selected-file" mode="out-in">
          <ctrl-big-text v-if="selected" :key="selected.name" :value="selected.contents" :fileName="selected.name" fileType="sol" :title="selected.name">
            <source-code language="solidity" :code="selected.contents"></source-code>
          </ctrl-big-text>
        </transition>
      </template>

      <!-- Libraries -->
      <template v-if="libraries">
        <h3 class="subtitle">External Libraries</h3>
        <data-item type="externalLibraries" :data="libraries"></data-item>
      </template>

      <!-- Compilation settings -->
      <template v-if="verificationData">
        <h3 class="subtitle">Compilation settings</h3>
        <data-item :data="verificationData" type="compilationSettings"></data-item>
      </template>
    </div>

    <!-- Constructor Arguments -->
    <template v-if="constructorArgs">
      <h3 class="subtitle">Constructor Arguments</h3>
      <data-item :data="constructorArgs" type="constructorArguments"></data-item>
    </template>

    <!-- Bytecode -->
    <div class="section">
      <ctrl-big-text v-if="code" :value="code" title="Bytecode" height="10em"></ctrl-big-text>
    </div>

    <!-- Verify message -->
    <div class="verify" v-if="!verification.result && contractVerifierEnabled">
      <button class="btn big btn-brand" @click="verifyContract">Verify Contract</button>
    </div>
  </div>
</template>
<script>
import SourceCode from './SourceCode'
import CtrlBigText from './controls/CtrlBigText'
import DataItem from './DataItem'
import { ROUTES } from '../config/types'
import { mapGetters } from 'vuex'
export default {
  name: 'contract-code',
  components: {
    SourceCode,
    CtrlBigText,
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
    },
    remixLink () {
      const address = this.data.address

      // backend url format: without protocol and trailing slash
      // const backend = process.env.WS_URL // Staging behind VPN -> Remix cannot reach it
      const backend = 'mock-backend.netlify.app/.netlify/functions/index' // TODO: Update with the correct backend once QA is done
      const link = `https://remix.ethereum.org/?address=${address}&blockscout=${backend}`

      return link
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
<style>
</style>
