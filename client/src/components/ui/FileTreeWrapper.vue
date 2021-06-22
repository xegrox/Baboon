<template>
  <div>
    <FileTree :item="root" :activePath="activePath" :allowFile="allowFile" :allowFolder="allowFolder" @update:activePath="onActiveUpdate" @clickFile="$emit('clickFile', $event)" @contextmenu.prevent="showMenu($event)"/>
    <ContextMenu ref="ctxmenu">
      <ContextMenuItem text="New file" shortcut="A"/>
      <ContextMenuItem text="New folder" shortcut="Shift+A"/>
      <ContextMenuItem text="Delete" shortcut="Backspace"/>
    </ContextMenu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TreeBranch } from 'types/TreeNode.interface'
import FileTree from './FileTree.vue'
import ContextMenu from 'components/ui/ContextMenu.vue'
import ContextMenuItem from 'components/ui/ContextMenuItem.vue'

export default defineComponent({
  components: {
    FileTree,
    ContextMenu,
    ContextMenuItem
  },
  props: {
    path: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    allowFile: {
      type: Boolean,
      default: true
    },
    allowFolder: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      root: <TreeBranch>{
        name: this.name,
        path: this.path,
        children: [],
        expanded: false
      },
      activePath: this.path
    }
  },
  methods: {
    showMenu(e: MouseEvent) {
      var menu = this.$refs.ctxmenu as any
      menu.setPos(e.x, e.y)
      menu.open()
    },
    onActiveUpdate(path: string) {
      this.activePath = path
      this.$emit('update:activePath', path)
    }
  }
})
</script>
