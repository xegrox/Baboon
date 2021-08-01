<template>
  <div>
    <div :style="indent" class="flex gap-2 rounded-lg items-center bg-gray-100 bg-opacity-0 hover:bg-opacity-5 transition-colors pr-5 pt-2 pb-2" :class="{ 'bg-opacity-10': isActive, 'pointer-events-none opacity-50': !isBranch && disabled }" @contextmenu.prevent="onRightClick" @click="onClick">
      <component :is="isBranch ? 'FolderIcon': 'FileIcon'" class="flex-none text-white"/>
      <p class="text-white truncate text-sm">{{ node.name }}</p>
      <ChevronDownIcon v-if="isBranch" class="flex-none ml-auto text-gray-400 transition-all transform" :class="{ 'rotate-180': castBranch(node).expanded }"/>
    </div>
    <TransitionExpand>
      <div v-if="isBranch" v-show="castBranch(node).expanded">
        <FileTree
          v-for="node in castBranch(node).children"
          :key="node.name" :node="node" :depth="depth+1"
          :rootPath="rootPath"
          :allowFile="allowFile" :allowFolder="allowFolder"
          :activeNode="activeNode"
          @rightClickNode="echoRightClickEvent"
          @clickNode="echoClickEvent"/>
      </div>
    </TransitionExpand>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { FileInfoType } from 'api/sftp'
import { TreeNode, TreeBranch, TreeLeaf } from 'types/TreeNode.class'
import { FileIcon, FolderIcon, ChevronDownIcon } from '@zhuowenli/vue-feather-icons'
import TransitionExpand from 'components/ui/transitions/Expand.vue'
import p from 'path-browserify'

export default defineComponent({
  name: 'FileTree',
  components: {
    FileIcon,
    FolderIcon,
    ChevronDownIcon,
    TransitionExpand
  },
  props: {
    rootPath: {
      type: String,
      required: true
    },
    node: {
      type: Object as PropType<TreeNode>,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    activeNode: {
      type: Object as PropType<TreeNode>,
      required: true
    },
    // TODO: cleanup this
    allowFolder: {
      type: Boolean,
      default: true
    },
    allowFile: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isBranch(): boolean {
      return this.node instanceof TreeBranch
    },
    indent(): Object {
      return { 'padding-left': `${this.depth * 0.5 + 1.25}rem` }
    },
    isActive(): boolean {
      return this.activeNode === this.node
    },
    disabled(): boolean {
      if (!this.allowFolder && this.isBranch) return true
      if (!this.allowFile && !this.isBranch) return true
      return false
    }
  },
  methods: {
    echoClickEvent(n: TreeNode, e: MouseEvent) {
      this.$emit('clickNode', n, e)
    },
    echoRightClickEvent(n: TreeNode, e: MouseEvent) {
      this.$emit('rightClickNode', n, e)
    },
    castBranch(node: TreeNode): TreeBranch {
      return node as TreeBranch
    },
    toggleBranch(branch: TreeBranch) {
      if (branch.expanded) {
        branch.expanded = false
      } else {
        this.listBranch(branch).then((children) => {
          if (children) {
            branch.children = children
            branch.expanded = true
          }
        })
      }
    },
    onRightClick(event: MouseEvent) {
      this.$emit('rightClickNode', this.node, event)
    },
    onClick(event: MouseEvent) {
      this.$emit('clickNode', this.node, event)
      if (this.node instanceof TreeBranch) this.toggleBranch(this.node)
    },
    async listBranch(branch: TreeBranch): Promise<Array<TreeNode> | void> {
      let fullPath = p.join(this.rootPath, branch.relPath)
      return await this.$sftp.list(fullPath).then((list) => {
        return list.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name)
            return a.type === FileInfoType.dir ? -1 : 1
          }).flatMap<TreeNode>((f) => {
            let relPath = p.join(branch.relPath, f.name)
            switch (f.type) {
              case FileInfoType.dir:
                return new TreeBranch(f.name, relPath, branch)
              case FileInfoType.file:
                return new TreeLeaf(f.name, relPath, branch)
              default:
                return []
            }
          })
      }).catch(() => {})
    }
  }
})
</script>
