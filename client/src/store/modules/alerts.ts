import { AlertItem } from '../../types/AlertItem.interface'
import { mutationTree } from 'typed-vuex'

const state = {
  all: new Map<number, {
    count: number,
    item: AlertItem
  }>(),
  previousKey: 0
}

const mutations = mutationTree(state, {
  add(state, item: AlertItem) {
    var previousValue = state.all.get(state.previousKey)
    if (previousValue && JSON.stringify(previousValue.item) === JSON.stringify(item)) {
      previousValue.count += 1
    } else {
      state.previousKey += 1
      state.all.set(state.previousKey, {
        count: 1,
        item: item
      })
    }
  },

  remove: (state, key: number) => state.all.delete(key)
})

export default {
  namespaced: true,
  state,
  mutations
}
