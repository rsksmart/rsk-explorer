import { VueI, config } from './vue.instance'
import VueGtag from 'vue-gtm'

const { router } = config
const id = process.env['GA_TAG']
if (!id) throw new Error('Missing Google Analytics tag')
VueI.use(VueGtag, { id, vueRouter: router })
/* eslint-disable no-new */
new VueI(config).$mount('#app')
