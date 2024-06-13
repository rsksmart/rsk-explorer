<template>
  <div class="accordion">
    <button class="accordion-title" @click="toggleAccordion">
      <div class="accordion-name">
        {{ index + 1 }}. {{ title }}
      </div>
      <div class="accordion-icon">
        {{ isOpen ? '-' : '+' }}
      </div>
    </button>
    <div :class="['accordion-content-wrapper', { open: isOpen }]">
      <div class="accordion-content" ref="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Accordion',
  props: {
    title: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleAccordion () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.accordion-title {
  background: #333;
  color: #fff;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: background-color 0.5s ease;
  display: flex;
  justify-content: space-between;
}

.accordion-title:hover {
  background-color: #555;
}

.accordion-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-in-out;
}

.accordion-content-wrapper.open {
  grid-template-rows: 1fr;
}

.accordion-content {
  overflow: hidden;
  padding: 0 15px;
  color: #fff;
  border: 1px solid $newbw_700;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

</style>
