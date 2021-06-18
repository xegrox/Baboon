<template>
  <div>
    <div :style="indent" class="flex gap-2 rounded-lg items-center bg-gray-100 bg-opacity-0 hover:bg-opacity-5 transition-colors pr-5 pt-2 pb-2" :class="{ 'bg-opacity-10': isActive, 'pointer-events-none opacity-50': !isBranch(item) && disabled }" @click="onClick(item)">
      <component :is="isBranch(item) ? 'FolderIcon': 'FileIcon'" class="flex-none text-white"/>
      <p class="text-white truncate text-sm">{{ item.name }}</p>
      <ChevronDownIcon v-if="isBranch(item)" class="flex-none ml-auto text-gray-400 transition-all transform" :class="{ 'rotate-180': item.expanded }"/>
    </div>
    <TransitionExpand>
      <div v-if="isBranch(item)" v-show="item.expanded">
        <FileTree v-for="node in item.children" :key="node" :item="node" :depth="depth+1" :activePath="activePath" :allowFile="allowFile" :allowFolder="allowFolder" @update:activePath="$emit('update:activePath', $event)"/>
      </div>
    </TransitionExpand>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { FileInfoType } from '../../api/sftp'
import { TreeNode, TreeBranch, TreeLeaf } from '../../types/TreeNode.interface'
import { AlertType } from '../../types/AlertItem.interface'
import { FileIcon, FolderIcon, ChevronDownIcon } from '@zhuowenli/vue-feather-icons'
import TransitionExpand from '../ui/transitions/Expand.vue'
import normalize from 'normalize-path'

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
      type: Object as PropType<TreeBranch>,
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
    activePath: String,
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
    indent(): Object {
      return { 'padding-left': `${this.depth * 0.5 + 1.25}rem` }
    },
    isActive(): boolean {
      return this.activePath === this.item.path
    },
    disabled(): boolean {
      var isFolder = this.isBranch(this.item)
      if (!this.allowFolder && isFolder) return true
      if (!this.allowFile && !isFolder) return true
      return false
    }
  },
  methods: {
    isBranch(item: TreeNode): item is TreeBranch {
      return (item as TreeBranch).children != undefined
    },
    onClick(node: TreeNode) {
      if (!this.disabled) this.$emit('update:activePath', this.item.path)
      if (this.isBranch(node)) {
        !node.expanded ? this.fillChildren(node) : node.expanded = false
      }
    },
    fillChildren(branch: TreeBranch) {
      var accessor = this.$accessor
      branch.children = []
      this.$sftp.list(branch.path).exec({
        onSuccess(data) {
          data.forEach((f) => {
            var path = normalize(`${branch.path}/${f.name}`)
            switch(f.type) {
              case FileInfoType.dir:
                var d: TreeBranch = {
                  name: f.name,
                  path: path,
                  expanded: false,
                  children: []
                }
                branch.children.push(d)
                break
              case FileInfoType.file:
                var l: TreeLeaf = {
                  name: f.name,
                  path: path
                }
                branch.children.push(l)
            }
          })
          branch.expanded = true
        },
        onError(msg) {
          accessor.alerts.add({
            type: AlertType.Error,
            title: 'Failed get contents of folder',
            content: msg
          })
        }
      })
    }
  }
})
</script>

<style scoped>
</style>
