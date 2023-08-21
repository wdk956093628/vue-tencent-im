import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './sotre'
import chat from './utils/TencentCloudChat'
import './style.css'

const app = createApp(App)

app.use(store)
app.use(router)

// 全局：腾讯im即时通讯实例
// app.config.globalProperties.chat = chat

app.component.productionTip = false

app.provide('TencentChat', chat)
app.mount('#app')
