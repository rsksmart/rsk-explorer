import ToolTip from '../components/ToolTip.vue'
import BigField from '../components/BigField.vue'
import FieldIcon from '../components/FieldIcon.vue'
import { mSecondsAgo } from '../filters/TimeFilters'
import { mapGetters } from 'vuex'
export default {
  components: {
    ToolTip,
    BigField,
    FieldIcon
  },
  filers: {
    mSecondsAgo
  },
  data () {
    return {
      ttOpts: { trimAt: 'center' },
      defaultTrim: 6,
      trimIf: 24
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
    ...mapGetters([
      'blockStyle',
      'filterFieldValue']),
    cellStyle (field, value) {
      if (field) {
        let style = {}
        let type = field.type
        if (type === 'block') style.color = this.getBlockColor(value)
        return style
      }
    },
    getEventPosition (event) {
      if (!event) return
      let x = event.clientX
      let y = event.clientY
      return { x, y }
    },
    getRouterHashFromEvent (event) {
      let pos = this.getEventPosition(event)
      let hash = (pos) ? `${pos.x}:${pos.y}` : ''
      return hash
    }
  }
}
