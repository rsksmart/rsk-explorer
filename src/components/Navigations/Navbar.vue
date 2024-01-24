<template>
  <nav class="navbar">
    <SearchBox />
    <div>
      <img src="@/assets/svg/setting-icon.svg" alt="">
    </div>
  </nav>
</template>
<script>
import SearchBox from '@/components/Search/SearchBox.vue'
export default {
  components: {
    SearchBox
  }
}
</script>
