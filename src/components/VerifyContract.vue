<template lang="pug">
  .verify-contracts.section
    h2 Verify contract
    //- Form Errors
    .col(v-show='isWaiting')
      loading-circle(:size='30' )
    .errors(v-if='errors.length')
      .error(v-for='error in errors')
        small {{error}}

    form.flex(v-if='!verificationId' @submit.prevent='submit')
      form-row(v-bind='formFields.ADDRESS')
        input(name="address" type= "text" :value="address" @change="changeAddress($event.target.value)" size="50")

      form-row(v-bind='formFields.NAME')
        input(name="name" type="text" :value="name" @change='changeName($event.target.value)'  :class='cssClass("name")')

        //- Form errors
        template(v-for='[errored,error] in formErrors')
          .box(v-if='errored')
            h2.error {{error}}

        //-.contract(v-if='!isVerified')
          .items(v-if='contractData')
            .item(v-for='p,v in contractData')
              small {{ v | camel-case-to }}: {{p}}

      //- Verification form
      template(v-if='isVerifiable')
        form-row(v-bind='(hasFiles) ?formFields.FILES : formFields.SOURCE')
          ctrl-files(:multiple='hasFiles' @change='updateFiles' @error='addError' :class='cssClass("file")' accept='.sol')

        form-row(v-if='versionsData' v-bind='formFields.VERSION')
          select(v-model='version' name='version' :class='cssClass("version")')
            option(v-for="path,version in versions" :value='path') {{path}}
          ctrl-switch( :value='showAllVersions' @change='(value)=>showAllVersions=value' label='Show all versions')

        form-row(v-bind='formFields.OPTIMIZATION')
          ctrl-radio-grp.frow(name='optimization' @change='(value)=>settings.optimizer.enabled=value' :selected='settings.optimizer.enabled')

        form-row(v-bind='formFields.RUNS')
          input(type='text' name='runs' v-model='settings.optimizer.runs' :disabled='!settings.optimizer.enabled')

        form-row(v-bind='formFields.EVM')
          select(v-if='evmVersions' name='evm-version' v-model='settings.evmVersion')
            option(:value='undefined') latest
            option(v-for='evm in evmVersions' :value='evm') {{evm}}
        form-row(v-bind='formFields.LIBRARIES')
          .frow
            button.btn.bg-brand.white(type="button" @click='addLibrary' name="add-library")
              icon.white(name="plus")
              span Add library
        
        template(v-for='lib in libs')
          form-row(v-bind='formFields.LIB_NAME')
            input(type='text' v-model='lib.name')
          form-row(v-bind='formFields.LIB_ADDRESS')
            input(type='text' v-model='lib.address')
        .form-row
          button.btn.bg-brand.white.tab-title.big(name="submit") send

    //- Verification response
    div(v-if='verifierResponse')
      .error(v-if='verifierResponse.error')
        p {{verifierResponse.error}}

    //- Waiting for verification
    div(v-if='isWaitingForVerification')
      h3 {{messages().WAITING_VERIFICATION}}

    //- Verification Result
    template.errrors(v-if='verificationErrors')
      h3 {{messages().VERIFICATION_ERROR}}
      .row
        ul.small
          li.error(v-for='error in verificationErrors') {{error.formattedMessage}}

    .col(v-if='verificationDone')
      h3.brand(v-if='verificationSuccessful') {{messages().VERIFICATION_DONE}}
      template(v-else)
        h3.error(v-if='!verificationErrors') {{messages().VERIFICATION_FAILED}}
        .try-again
          button.big.bg-brand.white.btn.flex(@click='tryAgain') Try again

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import LoadingCircle from './LoadingCircle'
import CtrlFiles from './controls/CtrlFiles'
import CtrlSwitch from './controls/CtrlSwitch'
import CtrlRadioGrp from './controls/CtrlRadioGrp'
import FormRow from './FormRow'
import { isAddress } from '../lib/js/ethUtils'
import { camelCaseTo } from '../filters/TextFilters'
import { ObjectIdSecondsElapsed } from '../lib/js/utils'
import { messages, formFields } from '../config/verifyContractTexts'

const KEYS = {
  contract: '__contractVerifierContract',
  verify: '__contractVerifierVerify',
  isVerified: '__contractVerifierIsVerified',
  verificationResult: '__contractVerifierResult'
}

const VERSIONS_KEY = '__contractVerifierSOLCVersions'
const EVM_VERSIONS_KEY = '__contractVerifierEVMVersions'

const ID_TIMEOUT_SECONDS = 120

export default {
  name: 'verify-contract',
  components: {
    LoadingCircle,
    CtrlFiles,
    CtrlSwitch,
    CtrlRadioGrp,
    FormRow
  },
  filter: [camelCaseTo],
  data () {
    return {
      formFields,
      address: undefined,
      name: undefined,
      verificationId: undefined,
      files: [],
      source: undefined,
      showAllVersions: false,
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: undefined
      },
      version: undefined,
      libs: [],
      inputErrors: new Set(),
      errors: [],
      timer: undefined
    }
  },
  created () {
    let { contractAddress, id } = this.$route.params
    this.getVersions()
    this.reset()
    if (id) this.setVerificationId(id)
    if (contractAddress) {
      this.changeAddress(contractAddress)
    }
  },
  computed: {
    verificationResult () {
      return this.getPage()(KEYS.verificationResult)
    },

    verificationResultData () {
      let { data } = this.verificationResult || {}
      return data
    },

    verificationErrors () {
      let data = this.verificationResultData || {}
      let { result } = data
      return (result) ? result.errors : null
    },

    verificationDone () {
      let { verificationResultData } = this
      let { match } = (verificationResultData) || {}
      return undefined !== match
    },

    verificationSuccessful () {
      return this.verificationDone && this.verificationResultData.match === true
    },
    test () {
      return Object.values(KEYS).map(key => [key, this.isRequesting()(key)])
    },
    isWaiting () {
      let requesting = Object.values(KEYS).map(key => this.isRequesting()(key)).find(v => v !== null)
      return (requesting || this.timer) && !this.verificationDone
    },
    isWaitingForVerification () {
      let { verificationId, verificationResult } = this
      let requestingVerification = this.isRequesting()(KEYS.verificationResult)
      return verificationId && !verificationResult && requestingVerification
    },
    verifierResponse () {
      let { data, error, updateError } = this.getPage()(KEYS.verify)
      error = error || updateError
      if (data && data.id) {
        let { id } = data
        this.setVerificationId(id)
      }
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
      let data
      if (contract && contract.data) {
        const { address, name, contractInterfaces, timestamp } = contract.data
        data = { address, name, contractInterfaces, timestamp }
      }
      return data
    },
    isVerified () {
      let { data } = this.getPage()(KEYS.isVerified)
      return data
    },
    isVerifiable () {
      let { isVerified, contract, verificationId } = this
      return !isVerified && contract.data && !verificationId
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

    evmVersions () {
      let { data } = this.getPage()(EVM_VERSIONS_KEY) || {}
      return data
    },

    isReadyToSend () {
      let { address, settings, files, version, name, libs } = this
      let libraries = libs.reduce((v, a, i) => {
        let { name, address } = a
        if (address && name) {
          v[name] = address
        }
        return v
      }, {})
      let params = Object.assign({}, { address, settings, version, name })
      let ready = !Object.values(params).filter(v => undefined === v).length
      ready = (files.length) ? ready : false
      if (!ready) return false
      let imports = [...files]
      let source = imports[0].contents
      return Object.assign(params, { imports, source, libraries })
    },
    hasFiles () {
      return !!this.files.length
    },
    addressIsOk () {
      let { address } = this
      return (isAddress(address)) ? address : undefined
    },
    formErrors () {
      return [
        [this.isNotAContract, messages.NOT_CONTRACT],
        [this.isVerified, messages.IS_VERIFIED],
        [!this.addressIsOk, messages.INVALID_ADDRESS]
      ]
    },
    isIdOutDated () {
      let id = this.verificationId
      if (!id) return
      return ObjectIdSecondsElapsed(id) > ID_TIMEOUT_SECONDS
    }
  },
  methods: {
    ...mapActions(['fetchData', 'setKeyData']),
    ...mapGetters(['isRequesting', 'getPage']),

    reset () {
      clearTimeout(this.timer)
      this.timer = undefined
      this.clearErrors()
      Object.values(KEYS).forEach(key => {
        this.resetKeyData(key)
      })
    },

    resetKeyData (key) {
      this.setKeyData([key, { data: null }])
    },

    tryAgain () {
      this.setVerificationId(null)
    },
    addLibrary () {
      this.libs.push({ name: '', address: '' })
    },
    cssClass (input) {
      return (this.inputErrors.has(input)) ? ['error'] : []
    },
    clearErrors () {
      this.errors = []
      this.inputErrors.clear()
    },

    getVersions () {
      this.fetch({ action: 'getSolcVersions', key: VERSIONS_KEY })
      this.fetch({ action: 'getEvmVersions', key: EVM_VERSIONS_KEY })
    },

    setVerificationId (id) {
      let { address } = this
      if (id === this.verificationId) return
      this.verificationId = id
      this.$router.push({ params: { address, id } })
      this.resetKeyData(KEYS.verificationResult)
      if (id) this.getVerificationResult()
    },

    getVerificationResult () {
      clearTimeout(this.timer)
      this.timer = undefined
      const key = KEYS.verificationResult
      if (this.isRequesting()(key)) return
      if (this.verificationDone) return
      let id = this.verificationId
      if (id) {
        this.fetch({ key, params: { id }, action: 'getVerificationResult' })
        let vm = this
        this.timer = setTimeout(() => vm.getVerificationResult(), 5000)
      }
    },

    changeName (name) {
      this.name = name.trim()
      this.inputErrors.delete('name')
    },

    changeAddress (address) {
      this.address = address.trim()
      this.reset()
      if (this.addressIsOk) {
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
    messages () {
      return messages
    },
    updateFiles (files) {
      this.files = files
      this.inputErrors.delete('file')
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
      if (params) return this.requestVerification(params)
      this.clearErrors()
      if (!this.version) this.inputErrors.add('version')
      if (!this.files.length) this.inputErrors.add('file')
      if (!this.name) this.inputErrors.add('name')
    },

    async requestVerification (request) {
      let action = 'verify'
      let key = KEYS.verify
      return this.fetch({ action, params: { request }, key })
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'

  .verify-contracts
    flex-flow column nowrap !important

    svg.loading-circle
      fill none
      stroke green
    .try-again
      padding 2em  
</style>
