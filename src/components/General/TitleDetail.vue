<template>
  <div class="title-detail flex">
    <icon :class="titleDescription" :name="icon"></icon>
    <div class="text-white-100">
      <tool-tip :text="value" :hideCopy="true" :trim="data[routerName].hideTrim" />
      <span class="capitalize"> {{ titleDescription }}</span>
    </div>
  </div>
</template>
<script>
import ToolTip from '@/components/General/Tooltip.vue'
export default {
  components: { ToolTip },
  name: 'title-detail',
  props: [
    'titleDescription',
    'page'
  ],
  data () {
    return {
      data: {
        transaction: {
          icon: 'transaction',
          txt: 'hash',
          hideTrim: false
        },
        block: {
          icon: 'transaction',
          txt: 'number',
          hideTrim: true
        },
        address: {
          icon: 'addresses',
          txt: 'address',
          hideTrim: false
        },
        'internal transaction': {
          icon: 'transaction',
          txt: 'internalTxId',
          hideTrim: false
        },
        event: {
          icon: 'transaction',
          txt: 'eventId',
          hideTrim: false
        },
        'token account': {
          icon: 'transaction',
          txt: 'address',
          hideTrim: false
        }
      }
    }
  },
  computed: {
    value () {
      const value = this.data[this.routerName].txt
      return this.page.data[value]
    },
    icon () {
      const icon = this.data[this.routerName].icon
      return icon
    },
    routerName () {
      return this.$route.name.toLowerCase()
    }
  }
}
</script>
