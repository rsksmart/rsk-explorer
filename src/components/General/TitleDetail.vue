<template>
  <div class="title-detail flex">
    <icon :class="titleDescription" :name="titleDescription.toLowerCase()"></icon>
    <div class="text-white-100 first-leter-uppercase">{{ page.data.number }} {{ titleDescription }}</div>
  </div>
</template>
<script>
export default {
  name: 'title-detail',
  props: [
    'titleDescription',
    'page'
  ]
}
</script>
