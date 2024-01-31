<template>
  <div class="event-call" v-if="data">
    <ul class="event">
      <li class="event-name">{{ name }}
        <template v-if="inputs">
          <ul class="args" v-for="(arg, i) in inputs" :key="i">
            <li class="type" :key="`1-${i}`" :style="{ color: PAGE_COLORS[$route.name].cl }">{{ arg.type }}</li>
            <li class="index" v-if="arg.indexed">indexed</li>
            <li class="name">{{ arg.name }}</li>
          </ul>
        </template>
      </li>
    </ul>
  </div>
</template>
<script>
import { PAGE_COLORS } from '../config/pageColors'
export default {
  name: 'event-call',
  props: ['data'],
  data () {
    return {
      PAGE_COLORS
    }
  },
  computed: {
    name () {
      return this.data.name
    },
    inputs () {
      return this.data.inputs
    }
  }
}
</script>
<style lang="stylus">

  .event-call
    margin 0
    display flex
    .index
      font-size .8em

    li.event-name
      font-weight bold
      color $info

    ul
      raw()
      font-size .9em
      list-style none
      align-items flex-end
      font-style italic
      font-weight normal
      margin 0
      padding 0
      flex-flow row wrap
      li
        color white

    ul,li
      margin 0 0.25em 0 0
      display flex

      &:last-child:after
        font-weight bold

    .args
      &::before
        content '('

      &::after
        content ')'

      .type
        color white
        &:after
          content ''

      .name
        font-size 0.9em
        // color green

        &:after
          content ','
          font-size 1em

        &:last-child:after
          content none
</style>
