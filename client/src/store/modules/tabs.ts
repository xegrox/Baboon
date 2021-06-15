import { mutationTree } from 'typed-vuex'
import TabItem from '../../interfaces/TabItem.interface'

const state = {
  all: Array<TabItem>(),
  activeIndex: 0
}

const mutations = mutationTree(state, {
  add(state, item: TabItem) {
    state.all.push(item)
  },

  remove(state, index: number) {
    state.all.splice(index, 1)
  },

  updateActive(state, index: number) {
    state.activeIndex = index
  },

  updateDoc(state, _: {index: number, doc: CodeMirror.Doc}) {
    state.all[_.index].doc = _.doc
  }
})

export default {
  namespaced: true,
  state,
  mutations
}
