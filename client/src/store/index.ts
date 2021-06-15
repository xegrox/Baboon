import { createStore } from 'vuex'
import { useAccessor } from 'typed-vuex'
import Alerts from './modules/alerts'
import Tabs from './modules/tabs'

const storePattern = {
  modules: {
    alerts: Alerts,
    tabs: Tabs,
  }
}

const store = createStore(storePattern)

export const accessor = useAccessor(store, storePattern)

export default store
