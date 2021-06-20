import { TabItem } from './TabItem.interface'

export class ProjectItem {
  name: string
  path: string
  activeTabPath = ''
  tabs = new Map<string, TabItem>()

  constructor(name: string, path: string) {
    this.name = name
    this.path = path
  }

  addTab(path: string) {
    this.tabs.set(path, {
      path: path,
      modified: false
    })
    this.activeTabPath = path
  }

  removeTab(path: string) {
    this.tabs.delete(path)
    if (path === this.activeTabPath && this.tabs.size > 0) {
      this.activeTabPath = this.tabs.values().next().value.path
    }
  }

  updateActiveTab(path: string) {
    if (!this.tabs.has(path)) return
    this.activeTabPath = path
  }
}
