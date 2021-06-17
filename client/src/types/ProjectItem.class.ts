import { TabItem } from './TabItem.interface'

export class ProjectItem {
  path: string
  activeTabPath = ''
  tabs = new Map<string, TabItem>()

  constructor(path: string) {
    this.path = path
  }

  addTab(item: TabItem) {
    this.tabs.set(item.path, item)
    this.activeTabPath = item.path
  }

  removeTab(path: string) {
    this.tabs.delete(path)
    if (path === this.activeTabPath && this.tabs.size > 0) {
      this.updateActiveTab(this.tabs.values().next().value.path)
    }
  }

  updateActiveTab(path: string) {
    if (!this.tabs.has(path)) return
    this.activeTabPath = path
  }
}
