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
    },
    hideMenu () {
      this.enabled = false
    }
  }
}
</script>
