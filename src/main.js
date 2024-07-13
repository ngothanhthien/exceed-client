import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './style.css'
/**
 * PaperCSS
 * https://www.getpapercss.com/docs/components/buttons/
 */
import 'papercss/dist/paper.min.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import axios from 'axios'
import VueAxios from 'vue-axios'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(VueAxios, axios)
app.use(router)
app.mount('#app')
