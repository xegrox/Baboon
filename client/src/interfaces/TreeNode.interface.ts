export interface TreeNode {
  name: string
  path: string
}

export interface TreeLeaf extends TreeNode {}

export interface TreeBranch extends TreeNode {
  expanded: boolean
  children: Array<TreeNode>
}
