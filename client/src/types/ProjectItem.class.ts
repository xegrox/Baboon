import { TabsPrototype } from './TabsPrototype.class'

export interface EditorPaneTab {
  path: string,
  modified: boolean,
  saving: boolean
}

export class ProjectItem {
  name: string
  path: string
  editorPaneTabs = new TabsPrototype<EditorPaneTab>()

  constructor(name: string, path: string) {
    this.name = name
    this.path = path
  }
}
