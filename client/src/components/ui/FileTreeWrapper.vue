<template>
  <div>
    <FileTree :item="root" :activePath="active.path" :allowFile="allowFile" :allowFolder="allowFolder" @update:activePath="onActiveUpdate" @contextmenu.prevent="showCtxMenu($event)" @clickItem="(p, b) => $emit('clickItem', p, b)"/>
    <ContextMenu ref="ctxmenu">
      <ContextMenuItem text="New file" shortcut="A" @click="showPathPrompt('newFilePrompt')"/>
      <ContextMenuItem text="New folder" shortcut="Shift+A" @click="showPathPrompt('newFolderPrompt')"/>
      <ContextMenuItem text="Delete" shortcut="Backspace" @click="showActionDialog('deletePathDialog')"/>
    </ContextMenu>
    <InputPrompt ref="newFilePrompt" placeholder="Path to new file" @enter="createNewFile"/>
    <InputPrompt ref="newFolderPrompt" placeholder="Path to new folder" @enter="createNewFolder"/>
    <ActionDialog ref="deletePathDialog" message="Are you sure you want to permanently delete the selected item?" actionText="Delete" @positive="deletePath(active.path)"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TreeBranch } from 'types/TreeNode.interface'
import FileTree from './FileTree.vue'
import ContextMenu from 'components/ui/ContextMenu.vue'
import ContextMenuItem from 'components/ui/ContextMenuItem.vue'
import InputPrompt from 'components/ui/InputPrompt.vue'
import ActionDialog from 'components/ui/ActionDialog.vue'
import { AlertType } from 'types/AlertItem.interface'
import { FileInfoType } from 'api/sftp'
import p from 'path-browserify'

export default defineComponent({
  components: {
    FileTree,
    ContextMenu,
    ContextMenuItem,
    InputPrompt,
    ActionDialog
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
    showActionDialog(refName: string) {
      var dialog = this.$refs[refName] as any
      dialog.open()
    },
    async checkFileExists(path: string) {
      return await this.$sftp.exists(path).exec<false | FileInfoType | undefined>({
        onSuccess: (exists) => {
          return exists
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
    alertPathExists() {
      this.$accessor.alerts.add({
        type: AlertType.Error,
        title: 'Path with same name already exists'
      })
    },
    alertPathNotExists() {
      this.$accessor.alerts.add({
        type: AlertType.Error,
        title: 'Path does not exists'
      })
    },
    createNewFile(path: string) {
      this.checkFileExists(path).then((exists) => {
        if (exists) {
          this.alertPathExists()
          return
        } else {
          this.$sftp.write(path, '').exec({
            onSuccess: () => {
              // TODO: refresh tree
              (this.$refs.newFilePrompt as any).close()
            },
            onError: (msg) => {
              this.$accessor.alerts.add({
                type: AlertType.Error,
                title: 'Failed to create new file',
                content: msg
              })
            }
          })
        }
      })
    },
    createNewFolder(path: string) {
      this.checkFileExists(path).then((exists) => {
        if (exists) {
          this.alertPathExists()
        } else {
          this.$sftp.mkdir(path).exec({
            onSuccess: () => {
              (this.$refs.newFolderPrompt as any).close()
            },
            onError: (msg) => {
              this.$accessor.alerts.add({
                type: AlertType.Error,
                title: 'Failed to create folder',
                content: msg
              })
            }
          })
        }
      })
    },
    deletePath(path: string) {
      this.checkFileExists(path).then((exists) => {
        if (!exists) {
          this.alertPathNotExists()
        } else if (exists === FileInfoType.dir) {
          this.$sftp.rmdir(path).exec({
            onSuccess: () => {
              (this.$refs.deletePathDialog as any).close()
            },
            onError: (msg) => {
              this.$accessor.alerts.add({
                type: AlertType.Error,
                title: 'Failed to delete folder',
                content: msg
              })
            }
          })
        } else {
          this.$sftp.delete(path).exec({
            onSuccess: () => {
              (this.$refs.deletePathDialog as any).close()
            },
            onError: (msg) => {
              this.$accessor.alerts.add({
                type: AlertType.Error,
                title: 'Failed to delete file',
                content: msg
              })
            }
          })
        }
      })
    }
  }
})
</script>
