import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

library.add(fas)

const app = createApp(App)

// Configuration de Toast
const toastOptions = {
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(createPinia())
app.use(Toast, toastOptions)

app.mount('#app')