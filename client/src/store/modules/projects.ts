import { mutationTree, getterTree } from 'typed-vuex'
import { ProjectItem } from 'types/ProjectItem.class'

const state = {
  all: new Map<string, ProjectItem>(),
  activePath: ''
}

const mutations = mutationTree(state, {
  add(state, item: ProjectItem) {
    state.all.set(item.path, item)
    state.activePath = item.path
  },

  remove(state, path: string) {
    state.all.delete(path)
    if (path === state.activePath && state.all.size > 0) {
      state.activePath = state.all.values().next().value.path
    }
  },

  updateActive(state, path: string) {
    if (!state.all.has(path)) return
    state.activePath = path
  }
})

const getters = getterTree(state, {
  active(state) {
    return state.all.get(state.activePath)
  }
})

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
