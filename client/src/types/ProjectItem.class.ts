import { TabsManager } from './TabsManager.class'
import { LSPWorkspace } from 'api/lsp'

export interface EditorPaneTab {
  relPath: string,
  savedContents: string,
  modified: boolean,
  saving: boolean
}

export class ProjectItem {
  name: string
  path: string
  editorPaneTabs = new TabsManager<EditorPaneTab>()
  // Key: url of lsp server
  lspWorkspaces = new Map<string, LSPWorkspace>()

  constructor(name: string, path: string) {
    this.name = name
    this.path = path
  }
}
