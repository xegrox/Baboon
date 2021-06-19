import { createStore } from 'vuex'
import { useAccessor } from 'typed-vuex'
import Alerts from './modules/alerts'
import Projects from './modules/projects'
import Sftp from './modules/sftp'

const storePattern = {
  modules: {
    alerts: Alerts,
    projects: Projects,
    sftp: Sftp
  }
}

const store = createStore(storePattern)

export const accessor = useAccessor(store, storePattern)

export default store
