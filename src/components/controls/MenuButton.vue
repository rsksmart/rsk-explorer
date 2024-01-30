<template>
  <div class="menu-button menu" :class="{'enabled': enabled}">
    <button class="btn" @click="switchMenu">
      <slot name="button"></slot>
    </button>
    <div class="menu-elements" v-show="enabled">
      <slot name="elements"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'menu-button',
  data () {
    return {
      enabled: false
    }
  },
  methods: {
    switchMenu () {
      this.enabled = !this.enabled
      if (this.enabled) {
        setTimeout(() => { this.enabled = false }, 3000)
      }
    },
    hideMenu () {
      this.enabled = false
    }
  }
}
</script>
