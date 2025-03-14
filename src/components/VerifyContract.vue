<template lang="pug">
.verify-contracts.section
    //- Form Errors
    h1 Verify contract
    .loading(v-show='isWaiting')
      <div class="waiting-result">
        spinner( :height="100" :width="100" :border="5")
        p(v-if='!verificationDone && timer') {{messages().WAITING_FOR_RESULT}}
      </div>
    .errors(v-if='errors.length')
      .error(v-for='error in errors')
        small {{error}}
    //- Verifier connection errors
    .error.center(v-if='verifierConnectionErrors')
      h3.error ERROR
      img(src='@/assets/svg/error-icon.svg')
      p {{messages().VERIFIER_DATA_ERROR}}
    template(v-else)
      template(v-if='!verificationId')
        form.flex
          form-row(v-bind='formFields.METHOD' v-if='!isVerified')
            select(name='method' :value='method' @change='setVerifyMethod($event.target.value)' :class='cssClass("version")')
              option(v-for="method in verifyMethods" :value='method') {{method}}
        form.flex(v-if='method === verifyMethods.STANDARD_JSON_INPUT' @submit.prevent='submit')
          form-row(v-bind='formFields.JSON')
            ctrl-files(@change='handleStandardJsonInput' @error='addError' :class='cssClass("file")' accept='.json')
          form-row(v-bind='formFields.NAME')
                input(name="name" type="text" :value="name" @change='changeName($event.target.value)'  :class='cssClass("name")')
          form-row(v-if='versionsData' v-bind='formFields.VERSION')
              select(name='version' :value='version' @change='changeVersion($event.target.value)' :class='cssClass("version")')
                option(v-for="path,version in versions" :value='path') {{path}}
          form-row(v-bind='abiEncodedArgs ? formFields.ENCODED_ARGUMENTS:formFields.CONSTRUCTOR_ARGUMENTS')
            input(type='text' v-model='constructorArguments')
          form-row(v-bind='formFields.ABI_ENCODED_ARGUMENTS')
            ctrl-radio-grp.frow(name='encoded' @change='(value)=>abiEncodedArgs=value' :selected='abiEncodedArgs')
          form-row
            button.brand.big(name="submit" :disabled="errors.length > 0")
              span Verify

        form.flex(v-if='method === verifyMethods.SOLIDITY_SOURCE_FILE' @submit.prevent='submit')
          form-row(v-bind='formFields.ADDRESS')
            input(name="address" type= "text" :value="address" @change="changeAddress($event.target.value)" size="50")

            //- Form errors
            template(v-for='[errored,error] in formErrors')
              //-FIX--------------------------------------------------
              template(v-if='errored')
                template(v-if='error === messages().IS_VERIFIED')
                  <br>
                  h3.brand Contract already verified
                  .row
                    button.link.big(@click.passive='goToContractPage') {{messages().SHOW_RESULT}}
                <p v-else>{{error}}</p>

            //-.contract(v-if='!isVerified')
              .items(v-if='contractData')
                .item(v-for='p,v in contractData')
                  small {{ v | camel-case-to }}: {{p}}

          //- Verification form
          template(v-if='isVerifiable')
            form-row(v-bind='formFields.NAME')
              input(name="name" type="text" :value="name" @change='changeName($event.target.value)'  :class='cssClass("name")')
            form-row(v-bind='(hasFiles) ? formFields.FILES : formFields.SOURCE')
              ctrl-files(:multiple='hasFiles' @change='updateFiles' @error='addError' :load-files='files' :class='cssClass("file")' accept='.sol')
            form-row(v-if='versionsData' v-bind='formFields.VERSION')
              select(name='version' :value='version' @change='changeVersion($event.target.value)' :class='cssClass("version")')
                option(v-for="path,version in versions" :value='path') {{path}}
              ctrl-switch( :value='showAllVersions' @change='(value) => changeAllVersions(value)' label='Show all versions')

            form-row(v-bind='formFields.OPTIMIZATION')
              ctrl-radio-grp.frow(name='optimization' @change='(value)=>settings.optimizer.enabled=value' :selected='settings.optimizer.enabled')

            form-row(v-bind='formFields.RUNS')
              input(type='text' name='runs' v-model='settings.optimizer.runs' :disabled='!settings.optimizer.enabled')

            form-row(v-bind='formFields.EVM')
              select(v-if='evmVersions' name='evm-version' v-model='settings.evmVersion')
                option(:value='undefined') latest
                option(v-for='evm in evmVersions' :value='evm') {{evm}}
            form-row(v-bind='abiEncodedArgs ? formFields.ENCODED_ARGUMENTS:formFields.CONSTRUCTOR_ARGUMENTS')
              input(type='text' v-model='constructorArguments')
            form-row(v-bind='formFields.ABI_ENCODED_ARGUMENTS')
              ctrl-radio-grp.frow(name='encoded' @change='(value)=>abiEncodedArgs=value' :selected='abiEncodedArgs')
            form-row(v-bind='formFields.LIBRARIES')
              .frow
                button.btn.brand(type="button" @click='addLibrary' name="add-library")
                  icon.white(name="plus")
                  span Add library
            //- Libraries
            template(v-for='lib in libs')
              form-row(v-bind='formFields.LIB_NAME')
                input(type='text' v-model='lib.name' v-bind='formFields.LIB_NAME.input')
              form-row(v-bind='formFields.LIB_ADDRESS')
                input(type='text' v-model='lib.address' v-bind='formFields.LIB_ADDRESS.input' )
            form-row
              button.brand.big(name="submit" :disabled="errors.length > 0")
                span Verify
              //-button.btn.big(name="submit" @click.passive='resetForm')
                span Reset

      //- Verification response
      //-div(v-if='verifierResponse')
        .error(v-if='verifierResponse.error')
          p {{verifierResponse.error}}

      //- Waiting for verification
      div(v-if='isWaitingForVerification')
        p.flex.justify-center.text-white-400 {{messages().WAITING_VERIFICATION}}

      //- Verification Result
      template.errrors(v-if='verificationErrors')
        p.flex.justify-center.text-white-400 {{messages().VERIFICATION_ERROR}}
        .row
          ul.small
            li.error(v-for='error in verificationErrors') {{error.formattedMessage}}

      .done(v-if='verificationDone || verificationErrors')
        template(v-if='verificationSuccessful')
          img(src='@/assets/svg/successfully.svg')
          h3.brand {{messages().VERIFICATION_DONE}}
          .row
            button.link.big(@click.passive='goToContractPage') {{messages().SHOW_RESULT}}

        template(v-else)
          .row
            h3.error(v-if='!verificationErrors') {{messages().VERIFICATION_FAILED}}
          .row(v-if='verificationTry')
            h4.info Try adding some of this parameters:
          ul
            li(v-for='v,p in verificationTry')
              strong {{p}}:
              pre {{v}}
          .row.try-again
            button.big.brand.btn.flex(@click.prevent='tryAgain') Try again

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import CtrlFiles from './controls/CtrlFiles'
import CtrlSwitch from './controls/CtrlSwitch'
import CtrlRadioGrp from './controls/CtrlRadioGrp'
import FormRow from './FormRow'
import { camelCaseTo } from '../filters/TextFilters'
import { ObjectIdSecondsElapsed, isAddress } from '../lib/js/utils'
import { messages, formFields } from '../config/texts/verifyContract'
import { ROUTES } from '../config/types'
import { UNSUPPORTED_SOLC_VERSIONS } from '@/config/entities/lib/solidityVersions'
import Spinner from './Loaders/Spinner'

const KEYS = {
  contract: '__contractVerifierContract',
  verify: '__contractVerifierVerify',
  isVerified: '__contractVerifierIsVerified',
  verificationResult: '__contractVerifierResult'
}

const VERSIONS_KEY = '__contractVerifierSOLCVersions'
const EVM_VERSIONS_KEY = '__contractVerifierEVMVersions'

const ID_TIMEOUT_SECONDS = 300

const VERIFY_METHODS = {
  SOLIDITY_SOURCE_FILE: 'Solidity source file',
  STANDARD_JSON_INPUT: 'Standard JSON input'
}

export default {
  name: 'verify-contract',
  components: {
    CtrlFiles,
    CtrlSwitch,
    CtrlRadioGrp,
    FormRow,
    Spinner
  },
  filter: [camelCaseTo],
  data () {
    return {
      formFields,
      address: undefined,
      name: undefined,
      verificationId: undefined,
      files: [],
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
      constructorArguments: undefined,
      abiEncodedArgs: false,
      inputErrors: new Set(),
      errors: [],
      timer: undefined,
      method: VERIFY_METHODS.SOLIDITY_SOURCE_FILE,
      sources: undefined,
      json: undefined
    }
  },
  created () {
    const { contractAddress, id } = this.$route.params
    this.getVersions()
    this.reset()
    if (id) this.setVerificationId(id)
    if (contractAddress) {
      this.changeAddress(contractAddress)
    }
  },
  computed: {
    ...mapGetters(['contractVerifierEnabled']),
    verifyMethods () {
      return VERIFY_METHODS
    },
    keys () {
      return KEYS
    },
    verificationResult () {
      return this.getPage()(KEYS.verificationResult)
    },

    verificationResultData () {
      const { data } = this.verificationResult || {}
      return data
    },

    verificationErrors () {
      const data = this.verificationResultData || {}
      const { result } = data
      return (result) ? result.errors : null
    },

    verificationTry () {
      const data = this.verificationResultData || {}
      const { result } = data
      return (result) ? result.tryThis : undefined
    },

    verificationDone () {
      const { verificationResultData } = this
      const { match } = (verificationResultData) || {}
      return undefined !== match
    },

    verificationSuccessful () {
      return this.verificationDone && this.verificationResultData.match === true
    },
    isWaiting () {
      const requesting = Object.values(KEYS).map(key => this.isRequesting()(key)).find(v => v !== null)
      return (requesting || this.timer) && !this.verificationDone
    },
    isWaitingForVerification () {
      const { verificationId, verificationResult } = this
      const requestingVerification = this.isRequesting()(KEYS.verificationResult)
      return verificationId && !verificationResult && requestingVerification
    },
    verifierResponse () {
      let { data, error, updateError } = this.getPage()(KEYS.verify)
      error = error || updateError
      if (data && data.id) {
        const { id } = data
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
      const { data, error } = this.getPage()(KEYS.contract) || {}
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
      const { data } = this.getPage()(KEYS.isVerified)
      return data
    },
    isVerifiable () {
      const { isVerified, contract, verificationId } = this
      return !isVerified && contract.data && !verificationId
    },
    isNotAContract () {
      const { address, contract } = this
      const { data, error } = contract
      return address && isAddress(address) && data === null && error
    },
    versionsData () {
      const { data } = this.getPage()(VERSIONS_KEY) || {}
      return data
    },
    versionsDataError () {
      const { error } = this.getPage()(VERSIONS_KEY) || {}
      return error
    },
    verifierConnectionErrors () {
      const { contractVerifierEnabled, versionsDataError } = this
      const { verifierResponse } = this
      return contractVerifierEnabled === false || versionsDataError || verifierResponse.error
    },
    versions () {
      const { showAllVersions, versionsData } = this
      let { builds, releases } = versionsData
      if (builds) builds = this.buildsList(builds)
      if (releases) releases = this.releasesList(releases)
      return (showAllVersions) ? builds : releases
    },
    evmVersions () {
      const { data } = this.getPage()(EVM_VERSIONS_KEY) || {}
      return data
    },

    isReadyToSend () {
      const { constructorArguments, encodedConstructorArguments } = this.getConstructorArguments()
      const { address, settings, files, version, name, libs, sources } = this

      if (!sources) { // solidity source file verification method
        const libraries = libs.reduce((v, a, i) => {
          const { name, address } = a
          if (address && name) {
            v[name] = address
          }
          return v
        }, {})
        const params = Object.assign({}, { address, settings, version, name })
        let ready = !Object.values(params).filter(v => undefined === v).length

        if (!ready) return false

        const imports = [...files]
        const source = imports[0].contents

        ready = (files.length) && this.isSupportedSolidityVersion() ? ready : false
        return Object.assign(params, { imports, source, libraries, constructorArguments, encodedConstructorArguments })
      } else { // standard json input verification method
        const params = Object.assign({}, { address, settings, version, name, sources })
        const ready = this.isSupportedSolidityVersion() && !Object.values(params).filter(v => undefined === v).length

        if (!ready) {
          return false
        } else {
          return Object.assign(params, { constructorArguments, encodedConstructorArguments })
        }
      }
    },
    hasFiles () {
      return !!this.files.length
    },
    addressIsOk () {
      const { address } = this
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
      const id = this.verificationId
      if (!id) return
      return ObjectIdSecondsElapsed(id) > ID_TIMEOUT_SECONDS
    }
  },
  methods: {
    ...mapActions(['fetchData', 'setKeyData']),
    ...mapGetters(['isRequesting', 'getPage']),
    setVerifyMethod (method) {
      this.clearErrors()
      this.sources = undefined
      this.method = method
      this.files = []
    },
    handleStandardJsonInput (json) {
      this.errors.pop()
      this.json = json
      if (json[0]) {
        try {
          const { sources, settings } = JSON.parse(json[0].contents)
          if (!sources) this.addError('Invalid JSON, missing sources')
          if (!settings) this.addError('Invalid JSON, missing settings')
          this.settings = settings
          this.sources = sources
          const fileName = json[0].name.replace('.json', '')
          if (this.name && fileName !== this.name) {
            this.addError(messages.JSON_INPUT_INVALID(this.name))
          }
        } catch (error) {
          this.addError(error)
        }
      }
    },
    reset () {
      clearTimeout(this.timer)
      this.timer = undefined
      this.clearErrors()
      Object.values(KEYS).forEach(key => {
        this.resetKeyData(key)
      })
    },

    resetForm () {
      this.$router.go()
    },

    resetKeyData (key) {
      this.setKeyData([key, { data: null }])
    },

    tryAgain (event) {
      const { verificationTry } = this
      if (verificationTry) {
        const { constructorArguments, encodedConstructorArguments } = verificationTry
        if (encodedConstructorArguments) {
          this.abiEncodedArgs = true
          this.constructorArguments = encodedConstructorArguments
        } else if (constructorArguments) {
          this.constructorArguments = constructorArguments.join(',')
        }
      }
      this.setVerificationId(undefined)
    },
    addLibrary () {
      const empty = this.libs.find(l => l.name === '')
      if (!empty) this.libs.push({ name: '', address: '' })
    },
    addConstructorArgumet () {
      this.constructorArguments.push('')
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
      const { address } = this
      if (id === this.verificationId) return
      this.verificationId = id
      this.$router.replace({ params: { contractAddress: address, id } })
      this.resetKeyData(KEYS.verify)
      this.resetKeyData(KEYS.verificationResult)
      if (id) this.getVerificationResult()
    },

    getVerificationResult () {
      clearTimeout(this.timer)
      this.timer = undefined
      const key = KEYS.verificationResult
      if (this.isRequesting()(key)) return
      if (this.verificationDone || this.verificationErrors) return
      const id = this.verificationId
      if (id) {
        this.fetch({ key, params: { id }, action: 'getVerificationResult' })
        this.timer = setTimeout(() => {
          this.getVerificationResult()
        }, 5000)
      }
    },

    changeName (name) {
      this.name = name.trim()
      this.inputErrors.delete('name')
      this.clearErrors()
      if (this.files.length > 0) {
        const hasMatchingFile = this.files.some(file => file.name.replace('.sol', '') === this.name)
        if (!hasMatchingFile) {
          this.errors.push(messages.CONTRACT_NAME_INVALID(this.name))
        } else {
          this.clearErrors()
        }
      }
      if (this.json && this.json[0]) {
        const fileName = this.json[0].name.replace('.json', '')
        if (fileName !== this.name) {
          this.addError(messages.JSON_INPUT_INVALID(this.name))
        }
      }
    },
    verifyContractName () {
      if (this.name && this.files.length > 0) {
        const hasMatchingFile = this.files.some(file => file.name.replace('.sol', '') === this.name)
        if (!hasMatchingFile) {
          this.errors.push(messages.CONTRACT_NAME_INVALID(this.name))
        }
      }
      if (this.name && this.json && this.json[0]) {
        const fileName = this.json[0].name.replace('.json', '')
        if (fileName !== this.name) {
          this.addError(messages.JSON_INPUT_INVALID(this.name))
        }
      }
    },
    changeAddress (address) {
      this.address = address.trim()
      this.reset()
      if (this.addressIsOk) {
        this.getContract()
        this.getIsVerified()
      }
    },
    changeVersion (version) {
      console.log('version in change is', version)
      this.version = version
      this.inputErrors.delete('version')
      this.errors.pop()
      if (!this.isSupportedSolidityVersion()) {
        this.errors.push(messages.NOT_SUPPORTED_SOLIDITY_VERSION_ERROR(version))
      }
      this.verifyContractName()
    },
    changeAllVersions (version) {
      this.showAllVersions = version
      this.inputErrors.delete('version')
      this.errors.pop()
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
      this.clearErrors()
      if (this.name && files.length > 0) {
        const hasMatchingFile = files.some(file => file.name.replace('.sol', '') === this.name)
        if (!hasMatchingFile) {
          this.errors.push(messages.CONTRACT_NAME_INVALID(this.name))
        } else {
          this.clearErrors()
        }
      }
    },
    buildsList (builds) {
      return builds.concat().reverse().reduce((v, a, i) => {
        const { longVersion } = a
        v[longVersion] = longVersion
        return v
      }, {})
    },
    releasesList (releases) {
      const newReleases = Object.assign({}, releases)
      for (const p in newReleases) {
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
      const params = this.isReadyToSend
      if (params) return this.requestVerification(params)
      this.clearErrors()
      if (!this.version) this.inputErrors.add('version')
      if (!this.files.length && !this.sources) this.inputErrors.add('file')
      if (!this.name) this.inputErrors.add('name')
      if (!this.isSupportedSolidityVersion()) {
        this.inputErrors.add('version')
        this.errors.push(messages.NOT_SUPPORTED_SOLIDITY_VERSION_ERROR(this.version))
      }
    },

    async requestVerification (request) {
      const action = 'verify'
      const key = KEYS.verify
      return this.fetch({ action, params: { request }, key })
    },
    goToContractPage () {
      const { address } = this
      const path = `/${ROUTES.address}/${address}`
      const query = { __ctab: 'code' }
      this.$router.push({ path, query })
    },
    getConstructorArguments () {
      let encodedConstructorArguments
      let { constructorArguments, abiEncodedArgs } = this
      if (abiEncodedArgs) {
        encodedConstructorArguments = constructorArguments
        constructorArguments = undefined
      }
      if (constructorArguments) constructorArguments = constructorArguments.split(',')
      return { constructorArguments, encodedConstructorArguments }
    },
    isSupportedSolidityVersion () {
      return !(UNSUPPORTED_SOLC_VERSIONS.find((v) => this.version.includes(v)))
    }
  }
}
</script>
