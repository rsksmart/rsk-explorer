import { VueI, config } from './vue.instance'
import VueGtag from 'vue-gtag'

const { router } = config
const id = process.env['GA_TAG']
console.log(process.env)
if (!id) throw new Error('Missing Google Analytics tag')
VueI.use(VueGtag, {
  config: { id }
}, router)
/* eslint-disable no-new */
new VueI(config).$mount('#app')
