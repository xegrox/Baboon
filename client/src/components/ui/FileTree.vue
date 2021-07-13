<template>
  <div>
    <div :style="indent" class="flex gap-2 rounded-lg items-center bg-gray-100 bg-opacity-0 hover:bg-opacity-5 transition-colors pr-5 pt-2 pb-2" :class="{ 'bg-opacity-10': isActive, 'pointer-events-none opacity-50': !isBranch && disabled }" @contextmenu.prevent="onRightClick" @click="onClick">
      <component :is="isBranch ? 'FolderIcon': 'FileIcon'" class="flex-none text-white"/>
      <p class="text-white truncate text-sm">{{ item.name }}</p>
      <ChevronDownIcon v-if="item.children" class="flex-none ml-auto text-gray-400 transition-all transform" :class="{ 'rotate-180': item.expanded }"/>
    </div>
    <TransitionExpand>
      <div v-if="item.children" v-show="item.expanded">
        <FileTree v-for="node in item.children" :key="node.name" :item="node" :depth="depth+1" :allowFile="allowFile" :allowFolder="allowFolder" :activePath="activePath" @rightClickNode="(n, e) => $emit('rightClickNode', n ,e)" @clickNode="(n, e) => $emit('clickNode', n, e)"/>
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
    item: {
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
    activePath: {
      type: String,
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
      return this.item instanceof TreeBranch
    },
    indent(): Object {
      return { 'padding-left': `${this.depth * 0.5 + 1.25}rem` }
    },
    isActive(): boolean {
      return this.activePath === this.item.path
    },
    disabled(): boolean {
      if (!this.allowFolder && this.isBranch) return true
      if (!this.allowFile && !this.isBranch) return true
      return false
    }
  },
  methods: {
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
      this.$emit('rightClickNode', this.item, event)
    },
    onClick(event: MouseEvent) {
      this.$emit('clickNode', this.item, event)
      if (this.item instanceof TreeBranch) this.toggleBranch(this.item)
    },
    async listBranch(branch: TreeBranch): Promise<Array<TreeNode> | void> {
      return await this.$sftp.list(branch.path).then((list) => {
        return list.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name)
            return a.type === FileInfoType.dir ? -1 : 1
          }).flatMap<TreeNode>((f) => {
            var path = p.join(branch.path, f.name)
            switch (f.type) {
              case FileInfoType.dir:
                return new TreeBranch(path, branch)
              case FileInfoType.file:
                return new TreeLeaf(path, branch)
              default:
                return []
            }
          })
      }).catch(() => {})
    }
  }
})
</script>
