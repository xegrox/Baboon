import { mutationTree } from 'typed-vuex'

const state = {
  connected: false,
  sessionId: ''
}

const mutations = mutationTree(state, {
  setConnected(state, bool: boolean) {
    state.connected = bool
  },
  setSessionId(state, id: string) {
    state.sessionId = id
  }
})

export default {
  namespace: true,
  state,
  mutations
}
