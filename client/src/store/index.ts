import { createStore } from 'vuex'
import { useAccessor } from 'typed-vuex'
import Alerts from './modules/alerts'
import LSPClients from './modules/lspclients'
import Panes from './modules/panes'
import Projects from './modules/projects'
import Sftp from './modules/sftp'

const storePattern = {
  modules: {
    alerts: Alerts,
    lspclients: LSPClients,
    panes: Panes,
    projects: Projects,
    sftp: Sftp
  }
}

const store = createStore(storePattern)

export const accessor = useAccessor(store, storePattern)

export default store
