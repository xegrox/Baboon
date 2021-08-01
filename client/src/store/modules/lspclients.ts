import { LSPClient } from 'api/lsp'

const state = {
  all: new Map<string, LSPClient>()
}

export default {
  namespaced: true,
  state
}
