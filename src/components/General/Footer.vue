<template>
  <footer>
    <div>
      Built by <span class="title">RootstockLabs</span>
      <div class="copy">Copyright &copy; {{ new Date().getFullYear() }} Rootstock Labs. All rights reserved.</div>
    </div>
    <div>
      <ul class="navigation">
        <li><a href="https://rootstock.io/" target="_blank">About Rootstock Labs </a></li>
        <li><a href="https://rootstock.io/contact/" target="_blank">Help</a></li>
        <li><a href="https://rootstock.io/terms-conditions/" target="_blank">Terms & Conditions</a></li>
        <li><a href="https://dev.rootstock.io/" target="_blank">Documentation</a></li>
      </ul>
    </div>
    <div class="social">
      <a href="https://twitter.com/rootstock_io" target="_blank">
        <x-icon />
      </a>
      <a href="https://github.com/rsksmart" target="_blank">
        <github-icon />
      </a>
      <a href="https://discord.com/invite/rootstock" target="_blank">
        <discord-icon />
      </a>
    </div>
    </footer>
</template>
<script>
import DiscordIcon from '@/icons/DiscordIcon.vue'
import XIcon from '@/icons/XIcon.vue'
import GithubIcon from '@/icons/GithubIcon.vue'
export default {
  components: {
    DiscordIcon,
    XIcon,
    GithubIcon
  }
}
</script>
