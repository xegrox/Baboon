import { LSPEntry } from 'types/LSPEntry.class'

const state = {
  all: new Map<string, LSPEntry>()
}

export default {
  namespaced: true,
  state
}
