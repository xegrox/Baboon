<template>
  <div>
    <FileTree :item="root" :activePath="active.path" :allowFile="allowFile" :allowFolder="allowFolder" @update:activePath="onActiveUpdate" @contextmenu.prevent="showCtxMenu($event)" @clickItem="(p, b) => $emit('clickItem', p, b)"/>
    <ContextMenu ref="ctxmenu">
      <ContextMenuItem text="New file" shortcut="A" @click="refNewFilePrompt.setValue(getActiveDirPath()); refNewFilePrompt.open()"/>
      <ContextMenuItem text="New folder" shortcut="Shift+A" @click="refNewFolderPrompt.setValue(getActiveDirPath()); refNewFolderPrompt.open()"/>
      <ContextMenuItem text="Delete" shortcut="Backspace" @click="refDeletePathPrompt.open()"/>
    </ContextMenu>
    <InputPrompt ref="newFilePrompt" placeholder="Path to new file" @enter="createNewFile"/>
    <InputPrompt ref="newFolderPrompt" placeholder="Path to new folder" @enter="createNewFolder"/>
    <ActionDialog ref="deletePathPrompt" message="Are you sure you want to permanently delete the selected item?" actionText="Delete" @positive="deletePath(active.path)"/>
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
  computed: {
    refNewFilePrompt(): any { return this.$refs.newFilePrompt as any },
    refNewFolderPrompt(): any { return this.$refs.newFolderPrompt as any },
    refDeletePathPrompt(): any { return this.$refs.deletePathPrompt as any }
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

    getActiveDirPath() {
      var dirPath = this.active.path
      if (!this.active.isFolder) dirPath = p.dirname(dirPath)
      if (dirPath.charAt(dirPath.length - 1) !== p.sep) dirPath += p.sep
      return dirPath
    },

    async checkFileExists(path: string) {
      return await this.$sftp.exists(path).exec<false | FileInfoType | undefined>({
        onSuccess: (exists) => {
          return exists
        },
        onError: (msg) => {
          this.$accessor.alerts.add({
            type: AlertType.Error,
            title: 'Unable to check if file exists',
            content: msg
          })
          return undefined
        }
      })
    },

    alertPathNotExists() {
      this.$accessor.alerts.add({
        type: AlertType.Error,
        title: 'Path does not exists'
      })
    },

    createNewFile(path: string) {
      this.refNewFilePrompt.setDisabled(true)
      this.checkFileExists(path).then((exists) => {
        if (exists) {
          this.refNewFilePrompt.setDisabled(false)
          this.refNewFilePrompt.setError('Path with same name already exists')
        } else {
          this.$sftp.write(path, '').exec({
            onSuccess: () => {
              // TODO: refresh tree
              this.refNewFilePrompt.setDisabled(false)
              this.refNewFilePrompt.close()
            },
            onError: (msg) => {
              this.refNewFilePrompt.setDisabled(false)
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
      this.refNewFolderPrompt.setDisabled(true)
      this.checkFileExists(path).then((exists) => {
        if (exists) {
          this.refNewFolderPrompt.setDisabled(false)
          this.refNewFolderPrompt.setError('Path with same name already exists')
        } else {
          this.$sftp.mkdir(path).exec({
            onSuccess: () => {
              this.refNewFolderPrompt.setDisabled(false)
              this.refNewFolderPrompt.close()
            },
            onError: (msg) => {
              this.refNewFolderPrompt.setDisabled(false)
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
      this.refDeletePathPrompt.setLoading(true)
      this.checkFileExists(path).then((exists) => {
        if (!exists) {
          this.refDeletePathPrompt.setLoading(false)
          this.alertPathNotExists()
        } else if (exists === FileInfoType.dir) {
          this.$sftp.rmdir(path).exec({
            onSuccess: () => {
              this.refDeletePathPrompt.setLoading(false)
              this.refDeletePathPrompt.close()
            },
            onError: (msg) => {
              this.refDeletePathPrompt.setLoading(false)
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
              this.refDeletePathPrompt.setLoading(false)
              this.refDeletePathPrompt.close()
            },
            onError: (msg) => {
              this.refDeletePathPrompt.setLoading(false)
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
