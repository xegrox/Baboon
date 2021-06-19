import { mutationTree } from 'typed-vuex'

const state = {
  connected: false
}

const mutations = mutationTree(state, {
  setConnected(state, bool: boolean) {
    state.connected = bool
  }
})

export default {
  namespace: true,
  state,
  mutations
}
