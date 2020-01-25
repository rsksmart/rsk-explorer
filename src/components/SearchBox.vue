<template lang="pug">
  .search
    ctrl-search(
      @change="search"
      @result="onResult"
      @input="onInput"
      :results="[...results]"
      :placeholder="placeholder"
      :cssClass="searchBoxClass")
</template>
<script>
import { testSearchedValue } from '../lib/js/validate'
import { mapState, mapGetters, mapActions } from 'vuex'
import { ROUTES as r } from '../config/types'
import CtrlSearch from './controls/CtrlSearch'
const requestPayloads = {
  block: {
    module: 'blocks',
    action: 'getBlock',
    searchField: 'hash',
    fields: { number: 1, hash: 1 }
  },
  transaction: {
    module: 'transactions',
    action: 'getTransaction',
    searchField: 'hash'
  },
  addressByName: {
    type: 'address',
    module: 'addresses',
    action: 'findAddresses',
    searchField: 'name',
    field: 'address',
    fields: { name: 1, address: 1 },
    getName: (data) => {
      let { address, name } = data
      return `${name} ${address}`
    }
  }
}
export default {
  name: 'search-box',
  components: {
    CtrlSearch
  },
  data () {
    return {
      msg: '',
      msgTimeout: null,
      requested: {},
      requestingTimeout: null
    }
  },
  computed: {
    ...mapState({
      lastBlocks: state => state.backend.lastBlocks
    }),
    ...mapGetters({
      lastBlock: 'lastBlock',
      net: 'bcNet'
    }),
    searchBoxClass () {
      return (this.msg) ? 'margin-less' : ''
    },
    placeholder () {
      return this.msg || 'Search'
    },
    chainId () {
      let { net } = this
      return (net) ? net.id : undefined
    },
    payloads () {
      let payloads = requestPayloads
      for (let p in payloads) {
        let data = payloads[p]
        let { fields, searchField, field, type } = data
        data.type = type || p
        fields = fields || {}
        fields[searchField] = 1
        fields[field] = 1
        data.fields = fields
        payloads[p] = data
      }
      return payloads
    },
    requestedKeys () {
      return Object.keys(this.requested)
    },
    requesting () {
      let { requestedKeys, isRequesting } = this
      return requestedKeys.filter(key => isRequesting()(key))
    },
    results () {
      let { requestedKeys, getPage, requested, getLink } = this
      let results = requestedKeys
        .map(key => {
          let res = getPage()(key)
          if (res) {
            let { data } = res
            if (!data) return
            let { type } = requested[key]
            let { searchField, field, getName } = this.getPayloadFromType(type)
            data = (!Array.isArray(data)) ? [data] : data
            return data.map(d => {
              if (!d) return
              let k = field || searchField
              let value = d[k]
              let link = getLink({ type, value })
              let name = (typeof getName === 'function') ? getName(d) : undefined
              return { link, type, value, name, data: d }
            })
          }
        })
        .filter(d => d)
      return [].concat.apply([], results)
    }
  },
  methods: {
    ...mapActions([
      'fetchData',
      'clearResponses'
    ]),
    ...mapGetters(['isRequesting', 'getPage']),
    isBlock (number) {
      number = parseInt(number)
      return number > -1
    },
    clearRequests () {
      let keys = [...this.requestedKeys]
      this.requested = {}
      this.clearResponses(keys)
    },
    ephemeralMessage (msg, duration) {
      duration = duration || 5000
      let vm = this
      this.msg = msg
      if (this.msgTimeout) clearTimeout(this.msgTimeout)
      this.msgTimeout = setTimeout(() => {
        vm.msg = null
        vm.msgTimeout = null
      }, duration)
    },
    getLink ({ type, value }) {
      let payload = this.getPayloadFromType(type)
      let path = r[payload.type]
      if (!path || !value) return
      let link = `/${path}/${value}`
      return link
    },
    goTo ({ type, value }) {
      let link = this.getLink({ type, value })
      if (!link) return
      this.clearRequests()
      this.$router.push(link)
    },
    request (value, type) {
      let payload = this.getPayloadFromType(type)
      if (!payload) return
      let { params, searchField } = payload
      let key = `search--${type}-${value}`
      params = params || {}
      params[searchField] = value
      payload.params = params
      this.$set(this.requested, key, { payload, type })
      payload.key = key
      return this.fetchData(payload)
    },
    onResult ({ event, value }) {
      this.clearRequests()
    },
    onInput ({ event, value }) {
      this.clearRequests()
      if (!value || value.length < 3) return
      let type = 'addressByName'
      this.request(value, type)
    },
    getPayloadFromType (type) {
      let payload = this.payloads[type]
      return (payload) ? Object.assign({}, payload) : {}
    },
    search ({ value, event }) {
      value = String(value).replace(/[\W_]+/g, '')
      this.clearRequests()
      if (!value) return
      let { chainId, lastBlock } = this

      // prevents errors when the lastBlock is unknown
      lastBlock = (lastBlock) ? lastBlock.number + 2 : undefined
      let test = testSearchedValue(value, { chainId, lastBlock })
      let types = Object.keys(test).filter(k => test[k])
      if (!types || !types.length) {
        this.$router.push(`/${r.search}/${value}`)
        this.ephemeralMessage(`Please type: address, block number or tx hash`)
      } else {
        return this.searchTypes(value, types)
      }
    },
    async searchTypes (value, types) {
      if (types.length === 1) {
        let type = types[0]
        return this.goTo({ type, value })
      } else {
        for (let type of types) {
          await this.request(value, type)
        }
        await this.waitForResults()
        let { results } = this
        // redirect when result once
        if (results && results.length === 1) {
          return this.goTo(results[0])
        }
      }
    },
    waitForResults () {
      let vm = this
      return new Promise((resolve) => {
        return vm.createTimeout(() => {
          if (vm.requesting.length) resolve(vm.waitForResults())
          else resolve(vm.results)
        })
      })
    },
    createTimeout (cb) {
      let { requestingTimeout } = this
      if (requestingTimeout) clearTimeout(requestingTimeout)
      this.requestingTimeout = setTimeout(cb, 200)
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  @import '../lib/styl/mixins.styl'

  .margin-less
    margin-bottom 0

  .search-msg
    flex-centered()
    flex-flow column wrap
    transition all 0.5s ease
    flex 0 1 100%
    opacity 1
    position relative
    margin-bottom -2em

  .search
    flex-flow row wrap

    ::placeholder
      color $graylight

    button
      margin 0 0.5rem 0 0
      display inline-block

  .msg-trans
    will-change opacity

  .msgtrans-enter-active
    opacity 0

  .msgtrans-leave-to
    transition all 0.5s ease
    transform translateY(-1em)
    opacity 0
</style>
