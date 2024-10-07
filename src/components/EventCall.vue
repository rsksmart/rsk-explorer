<template>
  <div class="event-details-container">
    <div class="event-details white-100" v-if="data">
      <span>{{ name }}{{ space }}</span>
      <span class="event-args">
        <span>{{ openingParen }}</span>
        <span class="event-arg" v-for="(arg, i) in inputs" :key="i">
          <span class="orange-900">{{ arg.type }}{{ space }}</span>
          <span class="white-400" v-if="arg.indexed">{{ indexed }}{{ space }}</span>
          <span>{{ arg.name }}</span>
          <span class="white-400" v-if="addComma(i, inputs)">{{ comma }}{{ space }}</span>
        </span>
        <span>{{ closingParen }}</span>
      </span>
    </div>
    <copy-button :value="eventSignature" title="Copy event signature" css=""/>
  </div>
</template>
<script>
import { PAGE_COLORS } from '../config/pageColors'
import CopyButton from './controls/CopyButton'

export default {
  name: 'event-call',
  props: ['data'],
  components: {
    CopyButton
  },
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
    },
    eventSignature () {
      const { name, inputs, space, indexed } = this
      const eventName = `${name}`

      const eventParams = inputs.map(input => {
        const inputType = input.type
        const inputName = input.name

        let formattedInputLine
        if (input.indexed) {
          formattedInputLine = `${inputType}${space}${indexed}${space}${inputName}`
        } else {
          formattedInputLine = `${inputType}${space}${inputName}`
        }
        return formattedInputLine
      })

      return `${eventName} (${eventParams.join(', ').trim()})`
    },
    openingParen () {
      return '\u0028'
    },
    closingParen () {
      return '\u0029'
    },
    comma () {
      return '\u002C'
    },
    space () {
      return ' '
    },
    indexed () {
      return 'indexed'
    }
  },
  methods: {
    addComma (index, list) {
      return index < list.length - 1
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.event-details-container {
  flex: 5;
  text-transform: none;
  display: flex;
  gap: 20px;
  justify-content: start;
  align-items: center;
}

.event-details {
  display: inline;

}

.event-args {
  display: inline;
}

.event-arg {
  display: inline;
}

.white-400 {
  color: $white_400;
}

.white-100 {
  color: $white_100;
}

.orange-900 {
  color: $orange_900;
}
</style>
