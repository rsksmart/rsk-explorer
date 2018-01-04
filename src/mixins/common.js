import ToolTip from '../components/ToolTip.vue'
import { mSecondsAgo } from '../filters/TimeFilters'
import { mapGetters } from 'vuex'
export default {
  components: {
    ToolTip
  },
  filers: {
    mSecondsAgo
  },
  data () {
    return {
      ttOpts: { trimAt: 'center' },
      trim: 8
    }
  },
  computed: {
    ...mapGetters({
      now: 'getDate',
      colors: 'getColors',
      getBlockColor: 'getBlockColor'
    })
  },
  methods: {
    ...mapGetters(['blockStyle', 'filterFieldValue']),
    cellStyle (field, value) {
      if (field) {
        let style = {}
        let type = field.type
        if (type === 'block') style.color = this.getBlockColor(value)
        return style
      }
    }
  }
}
