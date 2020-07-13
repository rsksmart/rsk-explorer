import { VueI, config } from './vue.instance'
import VueGtag from 'vue-gtag'
import Hotjar from 'vue-hotjar'

const { router } = config
const gaTag = process.env.GA_TAG
const hotjarId = process.env.HOTJAR_ID

if (gaTag) VueI.use(VueGtag, { config: { id: gaTag } }, router)
if (hotjarId) VueI.use(Hotjar, { id: hotjarId, isProduction: true, snippetVersion: 6 })

/* eslint-disable no-new */
new VueI(config).$mount('#app')
