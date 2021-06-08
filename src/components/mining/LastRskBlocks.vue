<template lang="pug">
  .section-wrapper
    .overflow-auto
      .box
        .main-dialog(v-if='lastBlock && hasBTCInfo')
          dialog-drag(:options="dialogOptions", title="BTC Info" @close="close")
            icon.close-button(name='close' slot='button-close')
            //- TODO: improve modal
            .dialog-content
              p Btc Height: {{lastRskBlocks[infoIndex].blockInBtc.btcHeight}}
              p BN: {{lastRskBlocks[infoIndex].blockInBtc.BN}}
              p CPV: {{lastRskBlocks[infoIndex].blockInBtc.CPV}}
              p NU: {{lastRskBlocks[infoIndex].blockInBtc.NU}}
              p Prefix Hash: {{lastRskBlocks[infoIndex].blockInBtc.prefixHash}}
        .data-table.overflow-auto
          h3 Last Rsk Blocks
          //- Table
          table.dark(v-if='data' ref='table')
            thead
              tr
                th.unsortable
                  field-title(:field="{title: 'BTC Info'}")
                template(v-for='field,fieldName,index in fields')
                  th.unsortable(v-if="!btcInfoFields.includes(fieldName)")
                    field-title(:field='field')
            tbody.table-body
              tr(v-for='row, rowIndex in lastRskBlocks' :class='rowClass(rowIndex)')
                td
                  template(v-if='row.hasBTCInfo')
                    button(@click="loadInfo(rowIndex, $event)")
                      icon(name='cubes')
                  div(v-else) N/A
                template(v-for='field,fieldName,index in fields')
                  td(v-if="!btcInfoFields.includes(fieldName)")
                    //- pre(style='text-align: left;') {{row}}
                    data-field(:field='field' :row='row')
</template>
<script>
import dataMixin from '../../mixins/dataMixin'
import DataField from '../DataField'
import DialogDrag from 'vue-dialog-drag'
import FieldTitle from '../FieldTitle'
import FieldIcon from '../FieldIcon'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'data-table',
  components: {
    DataField,
    FieldTitle,
    FieldIcon,
    DialogDrag
  },
  mixins: [
    dataMixin
  ],
  data () {
    return {
      type: 'lastRskBlocks',
      infoIndex: this.infoIndex,
      dialogOptions: { width: 660, height: 200, left: null, top: 200, id: 'btc-info-dialog', zIndex: 1500, buttonClose: true }
    }
  },
  mounted () {},
  computed: {
    ...mapState({
      size: state => state.size
    }),
    ...mapGetters({
      lastRskBlocks: 'getLastRskBlocks'
    }),
    lastBlock () {
      return this.lastRskBlocks[this.infoIndex]
    },
    hasBTCInfo () {
      return this.lastRskBlocks[this.infoIndex]?.hasBTCInfo
    },
    btcInfoFields () {
      return ['guessedMiner', 'btcHash', 'btcHeight', 'BN', 'CPV', 'NU', 'prefixHash']
    },
    data () {
      return []
    }
  },
  methods: {
    loadInfo (index, event) {
      this.infoIndex = index
    },
    close () {
      this.infoIndex = null
    }
  }
}
</script>

<style lang="stylus">
  @import '../../lib/styl/vars.styl'

  .section-wrapper
    position relative

  .overflow-auto
    overflo auto
    width 100%

    & .dialog-drag
      transform translateX(-50%)
      left 50%

  .table-body
    position relative
</style>
