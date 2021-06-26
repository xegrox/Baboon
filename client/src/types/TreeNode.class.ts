import p from 'path-browserify'

export class TreeNode {
  constructor(public path: string, public parent: TreeBranch | undefined) {}
  get name() {
    var name = p.basename(this.path)
    return name === '' ? p.sep : name
  }
}

export class TreeBranch extends TreeNode {
  constructor(public path: string, public parent: TreeBranch | undefined, public children = Array<TreeNode>(), public expanded = false) {
    super(path, parent)
  }
}

export class TreeLeaf extends TreeNode {
  constructor(public path: string, public parent: TreeBranch) {
    super(path, parent)
  }
}
