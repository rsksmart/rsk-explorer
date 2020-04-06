<template lang="pug">
  svg(:width='size', :height='size' :viewBox='viewBox' :x='xx' :y='yy' )
    //-rect(:width='size' :height='size' x='0' y='0')
    template(v-for='c in pos')
      svg(v-if='cubes[c-1]' :x='cubes[c-1].x', :y='cubes[c-1].y',:width='cs+"px"', :height='cs+"px"' viewBox='10 15 30 30')
        g.cube
          path.bg(fill='white', d='m 24.853203,2.9357662 c 0,0 -14.577404,4.6071848 -23.8719888,7.5356078 l 0.0910875,29.400269 23.7809013,7.613462 23.89186,-7.78049 -0.04156,-29.226136 z')
          path.fill(:style='cubeStyle(c)', opacity='.9', d='m 24.853203,2.9357662 c 0,0 -14.577404,4.6071848 -23.8719888,7.5356078 l 0.0910875,29.400269 23.7809013,7.613462 23.89186,-7.78049 -0.04156,-29.226136 z')
          path.front(fill='rgba(0,0,0,.3)' d='M 24.853203,47.485105 1.0723017,39.871643 0.9812142,10.471374 l 16.7437408,5.225635 7.128248,2.224714 z')
          path.top(fill='rgba(255,255,255,.2)' d='M 24.853203,17.921723 12.156786,13.959867 0.9812142,10.471374 24.853203,2.9357662 48.703509,10.478479 Z')
          path.side(fill='rgba(0,0,0,.15)' d='m 48.745063,39.704615 -23.89186,7.78049 V 17.921723 l 23.850306,-7.443244 z')
  </template>
<script>
export default {
  name: 'cube-of-cubes',
  props: ['size', 'x', 'y', 'mod', 'step', 'color', 'rows', 'cubeStyleCb'],
  data () {
    return {
      fX: 1.3,
      fY: 4,
      crows: 0
    }
  },
  created () {
    this.crows = this.rows || this.mod
  },
  computed: {
    cx () {
      return this.size / 2
    },
    yy () {
      return (this.y) ? (this.y - this.cx) + 'px' : null
    },
    xx () {
      return (this.x) ? (this.x - this.cx) + 'px' : null
    },
    viewBox () {
      return [0, 0, this.size, this.size].join(' ')
    },
    pos () {
      return this.step || this.max
    },
    max () {
      return Math.pow(this.mod, 3)
    },
    cs () {
      return this.size / (this.mod * 1.8)
    },
    cc () {
      return {
        x: this.cs / this.fX,
        y: this.cs / this.fY
      }
    },
    cubes () {
      let cubes = []
      const cs = this.cs
      const cc = this.cc
      const cmod = this.mod
      const cx = this.size / 1.8
      const cy = this.size / 2
      const crows = this.crows
      for (let j = 0; j < crows; j++) {
        const cyy = cy - (cs * j)
        for (let h = 0; h < cmod; h++) {
          cubes = this.cLine(cubes, cx + (cc.x * h), cyy + (cc.y * h))
        }
      }
      return cubes
    }
  },
  methods: {
    cLine (cubes, cx, cy) {
      const cc = this.cc
      const cmod = this.mod
      for (let i = 1; i <= cmod; i++) {
        const x = cx - (i * cc.x)
        const y = cy + (i * cc.y)
        cubes.push({ x, y })
      }
      return cubes
    },
    cubeStyle (cube) {
      const cb = this.cubeStyleCb
      if (cb && typeof (cb) === 'function') {
        return cb(cube)
      } else {
        return { fill: this.color }
      }
    }
  }
}
</script>
