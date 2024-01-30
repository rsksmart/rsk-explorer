<template>
  <nav class="navbar">
    <SearchBox />
    <div>
      <router-link to="/settings">
        <img src="@/assets/svg/setting-icon.svg" alt="">
      </router-link>
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
