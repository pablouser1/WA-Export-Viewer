import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './styles/bulma.scss'
import './styles/whatsapp.scss'

library.add(faUpload)

const app = createApp(App)
app.component('fa-icon', FontAwesomeIcon)
app.mount('#app')
