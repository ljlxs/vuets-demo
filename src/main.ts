// 公共样式
import 'vant/lib/index.css'
import './styles/main.scss'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(router)
app.use(pinia)
import './permission'

app.mount('#app')
