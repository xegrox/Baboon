export class TreeNode {
  constructor(
    public name: string,
    public relPath: string,
    public parent: TreeBranch | undefined) {}
}

export class TreeBranch extends TreeNode {
  constructor(
    public name: string,
    public relPath: string,
    public parent: TreeBranch | undefined,
    public children = Array<TreeNode>(),
    public expanded = false) {
    super(name, relPath, parent)
  }
}

export class TreeLeaf extends TreeNode {
  constructor(
    public name: string,
    public relPath: string,
    public parent: TreeBranch) {
    super(name, relPath, parent)
  }
}
