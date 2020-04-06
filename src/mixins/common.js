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
        const style = {}
        const type = field.type
        if (type === 'block') style.color = this.getBlockColor(value)
        return style
      }
    },
    getEventPosition (event) {
      if (!event) return
      const x = event.clientX
      const y = event.clientY
      return { x, y }
    },
    getRouterHashFromEvent (event) {
      const pos = this.getEventPosition(event)
      const hash = (pos) ? `${pos.x}:${pos.y}` : ''
      return hash
    }
  }
}
