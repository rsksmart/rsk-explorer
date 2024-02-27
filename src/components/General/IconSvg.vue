<template>
  <div class="container-icon">
    <miner-icon v-if="name === 'ellipsis'" />
    <credit-card-icon v-if="name === 'credit-card'" />
    <transaction-icon v-if="name === 'transaction' || name === 'transactions'" />
    <cube-icon v-if="name === 'cube'" />
    <load-icon v-if="name === 'load'" />
    <zap-icon v-if="name === 'zap'" />
  </div>
</template>

<script>
import MinerIcon from '../../icons/EllipsisIcon.vue'
import CreditCardIcon from '../../icons/CreditCardIcon.vue'
import TransactionIcon from '../../icons/TransactionIcon.vue'
import CubeIcon from '../../icons/CubeIcon.vue'
import LoadIcon from '../../icons/LoadIcon.vue'
import ZapIcon from '../../icons/ZapIcon.vue'

export default {
  components: {
    CreditCardIcon,
    MinerIcon,
    TransactionIcon,
    CubeIcon,
    LoadIcon,
    ZapIcon
  },
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
