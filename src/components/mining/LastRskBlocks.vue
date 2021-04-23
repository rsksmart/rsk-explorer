<template lang="pug">
  .section-wrapper
    .overflow-auto
      .box
        //- .main-dialog(v-if='lastBlock && hasBTCInfo')
        //-   dialog-drag(:options="dialogOptions" id="test", title="Post" @move='move')
        //-     icon.close-button(name='close' slot='button-close')
        //-     .dialog-content
        //-       div(v-for='field,fieldName,index in fields.blockInBTC')
        //-         field-icon(:icon='ent.icon' :title='ent.tooltip')
        //-         span {{ blockInBTC[ent.field] }}
        //-           data-field(:field='field' :row='blockInBTC')
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
      infoIndex: 0,
      dialogOptions: { width: 660, height: 600, left: null, top: -210, id: 'btc-info-dialog', zIndex: 1500 }
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
    move (e) {
      this.dialogOptions = e
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

  .dialog-content
    display grid
    grid-gap 1px
    grid-template-columns repeat(3, 100px)
    grid-template-rows repeat(3, 100px)
</style>
