<template>
  <div>
    <FileTree :item="root" :activePath="active.path" :allowFile="allowFile" :allowFolder="allowFolder" @update:activePath="onActiveUpdate" @contextmenu.prevent="showCtxMenu($event)" @clickItem="(p, b) => $emit('clickItem', p, b)"/>
    <ContextMenu ref="ctxmenu">
      <ContextMenuItem text="New file" shortcut="A" @click="showPathPrompt('newfileprompt')"/>
      <ContextMenuItem text="New folder" shortcut="Shift+A" @click="showPathPrompt('newfolderprompt')"/>
      <ContextMenuItem text="Delete" shortcut="Backspace"/>
    </ContextMenu>
    <InputPrompt icon="FileIcon" ref="newfileprompt" placeholder="Path to new file" @enter="createNewFile"/>
    <InputPrompt icon="FolderIcon" ref="newfolderprompt" placeholder="Path to new folder" @enter="createNewFolder"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TreeBranch } from 'types/TreeNode.interface'
import FileTree from './FileTree.vue'
import ContextMenu from 'components/ui/ContextMenu.vue'
import ContextMenuItem from 'components/ui/ContextMenuItem.vue'
import InputPrompt from 'components/ui/InputPrompt.vue'
import { AlertType } from 'types/AlertItem.interface'
import p from 'path-browserify'

export default defineComponent({
  components: {
    FileTree,
    ContextMenu,
    ContextMenuItem,
    InputPrompt
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
      active: {
        path: this.path,
        isFolder: true
      },
      createPath: ''
    }
  },
  methods: {
    showCtxMenu(e: MouseEvent) {
      var menu = this.$refs.ctxmenu as any
      menu.setPos(e.x, e.y)
      menu.open()
    },
    onActiveUpdate(path: string, isFolder: boolean) {
      this.active = { path, isFolder }
      this.$emit('update:activePath', path, isFolder)
    },
    showPathPrompt(refName: string) {
      var prompt = this.$refs[refName] as any
      var rootPath = this.active.path
      if (!this.active.isFolder) rootPath = p.dirname(rootPath)
      if (rootPath.charAt(rootPath.length - 1) !== p.sep) rootPath += p.sep
      prompt.setValue(rootPath)
      prompt.open()
    },
    async checkFileExists(path: string) {
      return await this.$sftp.exists(path).exec<boolean | undefined>({
        onSuccess: (exists) => {
          if (exists) {
            this.$accessor.alerts.add({
              type: AlertType.Error,
              title: 'File already exists'
            })
          }
          return exists ? true : false
        },
        onError: (msg) => {
          this.$accessor.alerts.add({
            type: AlertType.Error,
            title: 'Unable to check if file already exists',
            content: msg
          })
          return undefined
        }
      })
    },
    createNewFile(path: string) {
      this.checkFileExists(path).then((exists) => {
        if (exists) return
        this.$sftp.write(path, '').exec({
          onSuccess: () => {
            // TODO: refresh tree
            (this.$refs.newfileprompt as any).close()
          },
          onError: (msg) => {
            this.$accessor.alerts.add({
              type: AlertType.Error,
              title: 'Failed to create new file',
              content: msg
            })
          }
        })
      })
    },
    createNewFolder(path: string) {
      this.checkFileExists(path).then((exists) => {
        if (exists) return
        this.$sftp.mkdir(path).exec({
          onSuccess: () => {
            (this.$refs.newfolderprompt as any).close()
          },
          onError: (msg) => {
            this.$accessor.alerts.add({
              type: AlertType.Error,
              title: 'Failed to create folder',
              content: msg
            })
          }
        })
      })
    }
  }
})
</script>
