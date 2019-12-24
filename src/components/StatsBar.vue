<template lang="pug">
  .stats-bar.container
    .cols
      .col-a
        .cols
          //- first box
          .col-a
            box-field(:field='fields.hashrate' :row='stats')
          //- second box
          .col-b
            box-field(:field='fields.circulatingSupply' :row='stats')
      .col-b
        .cols
          //- third box
          .col-a
            box-field(:field='fields.bridgeBalance' :row='stats')
          //- fourth box
          .col-b
            box-field(:field='fields.activeAccounts' :row='stats')
</template>

<script>
import { mapState } from 'vuex'
import dataMixin from '../mixins/dataMixin'
import BoxField from './BoxField'
export default {
  name: 'stats-bar',
  mixins: [dataMixin],
  components: {
    BoxField
  },
  data () {
    return {
      type: 'stats'
    }
  },
  computed: {
    ...mapState({
      stats: state => state.backend.stats
    })
  }
}
</script>
