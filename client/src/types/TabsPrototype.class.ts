export class TabsPrototype<T> {
  private _all = new Map<string, T>()
  private _active = ''

  get all(): ReadonlyMap<string, T> {
    return this._all
  }

  set active(key: string) {
    if (!this._all.has(key)) return
    this._active = key
  }

  get active() {
    return this._active
  }

  add(key: string, tab: T) {
    this._all.set(key, tab)
    this._active = key
  }

  remove(key: string) {
    this._all.delete(key)
    if (key === this._active && this._all.size > 0) {
      this._active = this._all.values().next().value.path
    }
  }
}
