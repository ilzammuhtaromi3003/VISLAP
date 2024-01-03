/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import VueCookies from 'vue-cookies'

import VueSweetAlert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const app = createApp(App)

registerPlugins(app)

app.use(createPinia().use(piniaPluginPersistedState)).mount('#app')
const cookiesOptions = {
    httpOnly: false,
    maxAge: 72 * 60 * 60 * 1000,
    secure: true, //comment this line for localhost
    sameSite: false

};
app.use(VueCookies, cookiesOptions)
app.use(VueSweetAlert2)