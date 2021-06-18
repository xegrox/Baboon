import { createApp } from 'vue'
import App from 'pages/App.vue'
import 'assets/css/tailwind.css'
import { accessor } from 'store/index'
import SFTPHelper from 'api/sftp'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $accessor: typeof accessor,
    $connected: Boolean
  }
}

const app = createApp(App)
app.config.globalProperties.$accessor = accessor
app.use(SFTPHelper)
app.mount('#app')
