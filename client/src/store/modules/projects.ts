import { mutationTree } from 'typed-vuex'
import { ProjectItem } from 'types/ProjectItem.class'

const state = {
  all: new Map<String, ProjectItem>(),
  activePath: ''
}

const mutations = mutationTree(state, {
  add(state, item: ProjectItem) {
    state.all.set(item.path, item)
  },

  remove(state, path: string) {
    state.all.delete(path)
  },

  updateActive(state, path: string) {
    if (!state.all.has(path)) return
    state.activePath = path
  }
})

export default {
  namespaced: true,
  state,
  mutations
}
