import { LanguageServerClient } from 'api/lsp'

const state = {
  all: new Map<string, LanguageServerClient>()
}

export default {
  namespaced: true,
  state
}
