import { TabsManager } from './TabsManager.class'

export interface EditorPaneTab {
  path: string,
  modified: boolean,
  saving: boolean
}

export class ProjectItem {
  name: string
  path: string
  editorPaneTabs = new TabsManager<EditorPaneTab>()
  lspServerUrls = new Set<string>()

  constructor(name: string, path: string) {
    this.name = name
    this.path = path
  }
}
