
<template lang="pug">
  .tooltip(@mouseleave.passive='showTip(false)'
    @mouseenter.passive='showTip(true)'
    @touchend.passive='touch'
    :style='elStyle'
    )
    .trim(v-if='trimLen')
      slot(name='trim-1')
        template(v-if='routerLink')
          router-link(:to='routerLink')
            span {{trimed[0]}}
        span(v-else) {{trimed[0]}}
    slot(v-else)
      template(v-if='routerLink')
        router-link(:to='routerLink')
          span(ref='node-value') {{value}}
      span(v-else ref='node-value') {{value}}
      copy-button.left-button(v-if='opts.copy' :target='selectRef("node-value")' @copy='onCopy')
    .points(v-if='trimLen' :class='pointsClass')
        button(v-if='!show')
          span.icon {{ opts.trimTxt }}
        copy-button(v-if='show && opts.copy' :value='value' @copy='onCopy')
    .trim(v-if='trimed[1]')
      template(v-if='routerLink')
        router-link(:to='routerLink')
          span {{trimed[1]}}
      span(v-else) {{trimed[1]}}

    //- Tooltip
    .tip(v-if='show' :class='opts.pos' :style='tipPos')
      //- value
      .value(:class=' (clicked) ? "clicked" : ""' )
        .copy-txt(@touchend.stop='show = !show' @click.stop='showTip()')
          .tip-txt(:class='tipClass') {{value}}
</template>
<script>
/**
 *   - value: text to trim
  - trim: trim position, 0 not trim
  - options:
    - pos: [top | bottom | left | right], tooltip position
    - copy: [boolean], show copy button
    - trimAt: 'start' | 'end' | 'center'
    - trimTxt: '...' [string], symbol to replace trimmed text
    - forceTip: <boolean> force to show tip when not trim
 */
import CopyButton from './controls/CopyButton'
export default {
  name: 'tool-tip',
  components: {
    CopyButton
  },
  props: [
    'value',
    'trim',
    'options',
    'routerLink'
  ],
  data () {
    return {
      show: false,
      clicked: false,
      anim: false,
      closer: null,
      autoTrimLen: 0,
      elStyle: {
        'max-width': 'inherit !important',
        'overflow-x': 'hidden !important',
        display: 'block',
        position: 'absolute'
      },
      opts: {
        pos: 'top',
        trimAt: 'start',
        copy: true,
        trimTxt: '...',
        trimMin: 2,
        trimMax: 0,
        forceTrim: false,
        forceTip: false
      }
    }
  },
  created () {
    if (this.trim !== 'auto') this.elStyle = null
    if (this.options) {
      for (const op in this.options) {
        this.$set(this.opts, op, this.options[op])
      }
    }
  },
  mounted () {
    if (this.trim === 'auto') {
      const vm = this

      this.$nextTick(() => {
        vm.autoSize()
      })
    }
  },
  computed: {
    trimLen () {
      const trim = this.trim
      return (trim !== 'auto') ? this.trim : this.autoTrimLen
    },
    trimed () {
      let trimed = [this.value]
      const value = this.value
      const trimAt = this.opts.trimAt
      const len = this.value.length
      if (this.trimLen) {
        switch (trimAt) {
          case 'end':
            trimed = [value.substring(len - this.trimLen, len)]
            break
          case 'center':
            trimed = [value.slice(0, this.trimLen), value.slice(-this.trimLen)]
            break
          default:
            trimed = [value.substring(0, this.trimLen)]
            break
        }
      }
      return trimed
    },
    tipPos () {
      const pos = this.opts.pos
      if (pos === 'bottom' || pos === 'top') {
        const p = (pos === 'top') ? 'bottom' : 'top'
        return p + ':' + this.$el.clientHeight + 'px; left:0'
      }
      if (pos === 'left' || pos === 'right') {
        const p = (pos === 'left') ? 'right' : 'left'
        return p + ':' + this.$el.clientWidth + 'px;  bottom: -50%;'
      }
      return ''
    },
    tipClass () {
      const css = []
      if (this.anim) css.push('copying')
      if (this.value.length < 30) css.push('nowrap')
      return css
    },
    pointsClass () {
      const css = []
      const trimAt = this.opts.trimAt
      let pos = 'right'
      if (this.clicked) css.push('clicked')
      if (trimAt !== 'start') pos = (trimAt === 'end') ? 'left' : 'center'
      css.push(pos)
      return css
    }
  },
  methods: {
    autoSize () {
      const txt = this.value
      const parent = this.$parent.$el
      const parentWidth = parent.offsetWidth
      const style = window.getComputedStyle(parent)
      const font = `${style.fontSize} ${style.fontFamily}`
      const size = this.getTexWidth(txt, font)
      const fontSize = parseInt(style.fontSize.match(/(\d+)px/)[1] || 16)
      if (size > parentWidth || this.opts.forceTrim) {
        let trimLen = parentWidth / fontSize / 2
        const max = txt.length / 3
        const trimMin = this.opts.trimMin
        const trimMax = this.opts.trimMax
        trimLen = (trimLen > trimMin) ? trimLen : trimMin
        if (trimMax) {
          if (trimLen > trimMax || !trimLen) trimLen = trimMax
        }
        trimLen = (trimLen < max) ? trimLen : max
        this.autoTrimLen = parseInt(trimLen)
      }
      this.elStyle = ''
    },
    getTexWidth (txt, font) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      ctx.font = font
      const size = ctx.measureText(txt)
      return size.width
    },
    touch (value) {
      if (!value) value = !this.clicked
      this.clicked = value
      this.show = !this.show
      // timeout to close tip after, not for trimmeds
      if (this.show && !this.trimLen) {
        if (!this.closer) {
          const vm = this
          this.closer = setTimeout(() => {
            vm.show = false
          }, 3000)
        }
      }
    },
    onCopy () {
      this.anim = true
      // restart animation
      setTimeout(() => {
        this.anim = false
      }, 600)
    },
    showTip (show) {
      show = (undefined === show) ? !this.show : show
      if (this.trimLen || this.opts.forceTip) this.show = show
    },
    selectRef (name) {
      return this.$refs[name]
    }
  }
}
</script>
<style lang="stylus">
  $tip-arrow-size = 5px
  $tip-bg = white
  $tip-border = 1px

  .tooltip, .trim
    position relative
    display inline-flex
    overflow visible
    z-index 1000

  .nowrap
    white-space nowrap

  // Arrow mixin
  arrow(pos)
    if (pos == 'top' || (pos == 'bottom'))
      v = 'left'
      vv = 50%
    else
      v = 'bottom'
      vv = 50%

    &:after, &:before
      {pos} 100%
      {v} vv

    &:after
      border-{pos}-color $tip-bg
      margin-{v} $tip-arrow-size * -1

    &:before
      border-{pos}-color @color
      margin-{v} -($tip-arrow-size + $tip-border)

  .tooltip
    position relative
    display inline-flex
    flex-flow row nowrap
    justify-content center
    align-items center
    .copy-button
      .message
        z-index 100

    .left-button
      margin 0 0 0 .5em
    .tip
      will-change transform opacity
      position absolute
      filter drop-shadow($tip-sh)
      width 100%
      color $dark
      display flex
      justify-content flex-start // arrow on start
      animation 0.125s ease-in tooltip-anim
      z-index 50

      .value
        border-radius 3px
        padding 0.125em 0.25em
        background-color $tip-bg
        word-break break-all
        display flex
        justify-content center
        align-items center

      .tip-txt
        padding 0.25em
        overflow visible
        display inline
        margin 0
        font-size 1.1em
        font-weight normal

    .tip:after, .tip:before
      border solid transparent
      content ' '
      height 0
      width 0
      position absolute
      z-index 100

    .tip:after
      border-width $tip-arrow-size

    .tip:before
      border-width $tip-arrow-size + $tip-border

    // generates tip classes
    for pos in top bottom left right
      .tip.{pos}
        arrow(pos)

    .points
      display inline-flex
      box-shadow none

      button
        height auto
        width @height
        min-height 2em
        color @color
        margin 0 .25em

        .icon, .svg-icon
          display inline-flex
          color @color
          max-height 1em
          min-width 1em
          justify-content center
          align-items center

    .points.left
      float left
      justify-content flex-start

    .points.right
      float right
      justify-content flex-end

    .copy-txt
      display inline

    button.close
      line-height 1em
      height 1em

      &:after
        top 0.25em !important
        right 0.25em !important
        border-radius 50%
        line-height 1em
        height 1em
        width 1em
        padding 0.25em

  .head
    display block

  // Copy Animations
  .anim
    animation-duration 0.5s
    animation-name copya
    animation-timing-function ease-in-out
    opacity 0

    @keyframes copya
      0%
        opacity 0

      75%
        transform translateY(-1em)

      80%
        opacity 1

      100%
        opacity 0
        transform translateY(-5em)

  @keyframes tooltip-anim
    0%
      opacity 0
      transform scale(0.75)

    75%
      transform scale(1)

    100%
      opacity 1

  .copying
    animation-duration 1s
    animation-name copyb

  @keyframes copyb
    0%
      color @color

    100%
      color inherit
</style>
