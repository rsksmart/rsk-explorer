<template>
  <a v-if="remixLink" :href="remixLink" target="_blank" class="remix-link">
    <img src="@/assets/icons/remix.png" height="16px" width="16px" alt="Remix Icon" class="remix-icon" />
    Open in Remix
    <img src="@/assets/svg/link.svg" height="12px" alt="link icon">
  </a>
</template>

<script>
export default {
  name: 'RemixLink',
  props: {
    remixLink: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.remix-link {
  padding: 8px 10px;
  font-size: 12px;
  border-radius: 10px;
  background-color: none;
  color: $white_100;
  border: 2px solid $white_400;
  transition: background-color 0.3s ease, border 0.3s ease;
  text-decoration: none;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 6px;
  margin-right: 3px;

  &:hover {
    border: 2px solid $white_100;
  }
}
</style>
