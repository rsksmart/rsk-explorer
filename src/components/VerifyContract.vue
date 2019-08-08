<template lang="pug">
  .verify-contracts.centered
    h2 Verify contract
    //- Errors
    .col(v-if='isWaiting')
      loading-circle(:size='30' )
    .errors(v-if='errors.length')
      .error(v-for='error in errors')
        p {{error}}

    
    //- Contract data
    div(v-if='isNotAContract')
      h2 {{messages().NOT_CONTRACT}}
    .verified(v-if='isVerified')
      h2 {{messages().IS_VERIFIED}}
    .contract(v-if='!isVerified')
      .items(v-if='contractData')
        .item(v-for='p,v in contractData')
          small {{ v | camel-case-to }}: {{p}}
    //- address form
    template
      .form.centered
        //- Address
        fieldset.row
          label.small(for='address') {{messages().INSERT_ADDRESS}}
          input(name="address" type= "text" v-model.trim="address" @change="changeAddress" size="50")
    //- Files
    template(v-if='isVerifiable')
      .form.centered
        fieldset.centered.row
          label.small.col(for="file") {{ (hasFiles) ? 'Add imports' : 'Add main file' }}
          //- Files
          input(type="file" name="file" @change="addFiles" :multiple='hasFiles')
        //- files table
        .row
          table.dark(v-if='files.length')
            tr(v-for='file in files')
              td {{file.name}}
              td
                button(@click='removeFile(file.name)')
                  icon(name='close')
        fieldset.row.a-center(v-if='versionsData')
          .row
            label.small(for='select') {{messages().SOLIDITY_VERSION}}
            select(v-model='version' name='select')
              option(v-for="path,version in versions" :value='path') {{path}}
          
          .col
            input.col(type="checkbox" v-model='showAllVersions')
            label.small Show all versions
        
        fieldset
          input.col(type="checkbox" v-model='settings.optimizer.enabled')
          label.small optimize
        div

          button.btn.bg-brand.white.tab-title.big.full-w(name="submit" @click="submit") send
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { readTextFile } from '../lib/js/io'
import LoadingCircle from './LoadingCircle'
import { isAddress } from '../lib/js/ethUtils'
import { camelCaseTo } from '../filters/TextFilters'

const KEYS = {
  contract: 'cvContract',
  verify: 'cvVerify',
  isVerified: 'cvIsVerified'
}

const VERSIONS_KEY = 'cvVersions'

const messages = {
  INSERT_ADDRESS: 'Please insert the contract address',
  INVALID_ADDRESS: 'invalid address',
  NOT_CONTRACT: 'Is not a contract',
  IS_VERIFIED: 'The contract is already verified',
  NOT_SOURCE: 'the source is empty',
  SOLIDITY_VERSION: 'Please, select the solidity compiler version'
}

export default {
  name: 'verify-contract',
  components: {
    LoadingCircle
  },
  filter: [camelCaseTo],
  data () {
    return {
      address: undefined,
      files: [],
      source: undefined,
      showAllVersions: false,
      settings: {
        optimizer: {
          enabled: false
        }
      },
      version: undefined,
      errors: []
    }
  },
  created () {
    this.getVersions()
    this.reset()
  },
  computed: {
    isWaiting () {
      return Object.values(KEYS).map(key => this.isRequesting()(key)).find(v => v !== null)
    },
    verifyResponse () {
      let { data, error, updateError } = this.getPage()(KEYS.verify)
      error = error || updateError
      return { data, error }
    },
    isRequestingContract () {
      return this.isRequesting()(KEYS.contract)
    },
    isRequestingVerification () {
      return this.isRequesting()(KEYS.verify)
    },
    contract () {
      let { data, error } = this.getPage()(KEYS.contract) || {}
      return { data, error }
    },
    contractData () {
      const { contract } = this
      if (!contract) return
      if (contract.data) {
        const { address, name, contractInterfaces, timestamp } = contract.data
        return { address, name, contractInterfaces, timestamp }
      }
    },
    isVerified () {
      let { data } = this.getPage()(KEYS.isVerified)
      return data
    },
    isVerifiable () {
      let { isVerified, isRequesting, contract } = this
      return !isVerified && contract.data
    },
    isNotAContract () {
      const { address, contract } = this
      const { data, error } = contract
      return address && isAddress(address) && data === null && error
    },
    versionsData () {
      let { data } = this.getPage()(VERSIONS_KEY) || {}
      return data
    },
    versions () {
      let { showAllVersions, versionsData } = this
      let { builds, releases } = versionsData
      if (builds) builds = this.buildsList(builds)
      if (releases) releases = this.releasesList(releases)
      return (showAllVersions) ? builds : releases
    },
    isReadyToSend () {
      let { address, settings, files, version } = this
      let params = Object.assign({}, { address, settings, version })
      let ready = !Object.values(params).filter(v => undefined === v).length
      ready = (files.length) ? ready : false
      if (!ready) return false
      let imports = [...files]
      let source = imports[0].contents
      return Object.assign(params, { imports, source })
    },
    hasFiles () {
      return !!this.files.length
    },
    verifyData () {
      let { data } = this.getPage()(KEYS.verify) || {}
      return data || {}
    },
    addressIsOk () {
      let { address } = this
      return (isAddress(address)) ? address : undefined
    }
  },
  methods: {
    ...mapActions(['fetchData', 'setKeyData']),
    ...mapGetters(['isRequesting', 'getPage']),

    reset () {
      this.clearErrors()
      Object.values(KEYS).forEach(key => {
        this.setKeyData([key, { data: null }])
      })
    },

    addError (error) {
      this.errors.push(error)
    },
    clearErrors () {
      this.errors = []
    },
    getVersions () {
      this.fetch({ action: 'getVersions', key: VERSIONS_KEY })
    },

    changeAddress () {
      this.reset()
      if (!this.addressIsOk) {
        this.errors.push(messages.INVALID_ADDRESS)
      } else {
        this.getContract()
        this.getIsVerified()
      }
    },

    getContract (event) {
      const { address } = this
      this.fetch({ module: 'addresses', action: 'getCode', key: KEYS.contract, params: { address } })
    },

    getIsVerified () {
      const { address } = this
      this.fetch({ action: 'isVerified', key: KEYS.isVerified, params: { address } })
    },

    addError (error) {
      this.errors.push(`${error}`)
    },
    messages (error) {
      return messages
    },
    async addFiles (event) {
      try {
        let { target } = event
        let files = [...target.files]
        target.value = null
        for (let file of files) {
          let { name } = file
          let contents = await readTextFile(files[0])
          if (contents) {
            if (this.findFileKey(name) < 0) {
              this.files.push({ name, contents })
            }
          }
        }
      } catch (err) {
        this.addError(err)
      }
    },

    buildsList (builds) {
      return builds.reduce((v, a, i) => {
        let { version, longVersion } = a
        v[version] = longVersion
        return v
      }, {})
    },
    releasesList (releases) {
      let newReleases = Object.assign({}, releases)
      for (let p in newReleases) {
        newReleases[p] = newReleases[p].replace('soljson-v', '').replace('.js', '')
      }
      return newReleases
    },

    fetch ({ module, action, key, params }) {
      module = module || 'contractVerifier'
      params = params || {}
      return this.fetchData({ module, action, key, params })
    },

    submit () {
      let params = this.isReadyToSend
      if (!params) return
      return this.requestVerification(params)
    },

    requestVerification (params) {
      let action = 'verify'
      let key = KEYS.verify
      return this.fetch({ action, params, key })
    },

    findFileKey (fileName, files) {
      files = files || this.files
      console.log(files, fileName)
      return files.findIndex(f => f.name === fileName)
    },

    removeFile (fileName) {
      let files = [...this.files]
      let key = this.findFileKey(fileName, files)
      if (key > -1) files.splice(key, 1)
      this.files = files
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .verify-contracts
    svg.loading-circle
      fill none
      stroke green
</style>
