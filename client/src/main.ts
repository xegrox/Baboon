import { createApp, defineComponent, h, Component } from 'vue'
import NotFound from 'pages/NotFound.vue'
import App from 'pages/App.vue'
import FAQ from 'pages/FAQ.vue'
import Feedback from 'pages/Feedback.vue'
import FeedbackResult from 'pages/FeedbackResult.vue'
import Landing from 'pages/Landing.vue'
import 'assets/css/tailwind.css'
import { accessor } from 'store/index'
import SFTPHelper from 'api/sftp'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $accessor: typeof accessor,
    $connected: Boolean
  }
}

let routes: {
  [key: string]: Component
} = {
  '': Landing,
  '/app': App,
  '/faq': FAQ,
  '/feedback': Feedback,
  '/feedback_result': FeedbackResult
}

const app = createApp(defineComponent({
  data() {
    return {
      currentRoute: window.location.pathname.replace(/\/+$/, '')
    }
  },
  computed: {
    ViewComponent(): Component {
      return routes[this.currentRoute] || NotFound
    }
  },
  render() { return h(this.ViewComponent) }
}))

app.config.globalProperties.$accessor = accessor
app.use(SFTPHelper)
app.mount('#app')
