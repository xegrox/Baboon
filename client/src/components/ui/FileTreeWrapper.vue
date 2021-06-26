<template>
  <div>
    <FileTree :item="rootBranch" :activePath="activeNode.path" :allowFile="allowFile" :allowFolder="allowFolder" @rightClickNode="onRightClickNode" @clickNode="onClickNode"/>
    <ContextMenu ref="ctxmenu">
      <ContextMenuItem text="New file" shortcut="A" @click="openInputPathDialog(refNewFilePrompt)"/>
      <ContextMenuItem text="New folder" shortcut="Shift+A" @click="openInputPathDialog(refNewFolderPrompt)"/>
      <ContextMenuItem text="Delete" shortcut="Backspace" @click="refDeletePathPrompt.open()"/>
    </ContextMenu>
    <InputPrompt ref="newFilePrompt" placeholder="Path to new file" @enter="createNewFile"/>
    <InputPrompt ref="newFolderPrompt" placeholder="Path to new folder" @enter="createNewFolder"/>
    <ActionDialog ref="deletePathPrompt" message="Are you sure you want to permanently delete the selected item?" actionText="Delete" @positive="deletePath(activeNode.path)"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TreeNode, TreeBranch, TreeLeaf } from 'types/TreeNode.class'
import FileTree from './FileTree.vue'
import ContextMenu from 'components/ui/ContextMenu.vue'
import ContextMenuItem from 'components/ui/ContextMenuItem.vue'
import InputPrompt from 'components/ui/InputPrompt.vue'
import ActionDialog from 'components/ui/ActionDialog.vue'
import { AlertType } from 'types/AlertItem.interface'
import { SFTPAction, FileInfoType } from 'api/sftp'
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
    var rootBranch: TreeBranch = new TreeBranch(this.path, undefined)
    return {
      rootBranch: rootBranch,
      activeNode: rootBranch as TreeNode
    }
  },
  computed: {
    refNewFilePrompt(): any { return this.$refs.newFilePrompt as any },
    refNewFolderPrompt(): any { return this.$refs.newFolderPrompt as any },
    refDeletePathPrompt(): any { return this.$refs.deletePathPrompt as any }
  },
  methods: {
    getRootBranch() { return this.rootBranch },
    getActiveNode() { return this.activeNode },

    onRightClickNode(node: TreeNode, event: MouseEvent) {
      this.activeNode = node
      var menu = this.$refs.ctxmenu as any
      menu.setPos(event.x, event.y)
      menu.open()
      this.$emit('rightClickNode', node, event)
    },

    onClickNode(node: TreeNode, event: MouseEvent) {
      this.activeNode = node
      this.$emit('activePathUpdate', node.path)
      this.$emit('clickNode', node, event)
    },

    getNodeBranch(node: TreeNode): TreeBranch {
      return (node instanceof TreeLeaf) ? node.parent : node as TreeBranch
    },

    openInputPathDialog(ref: any) {
      ref.setValue(p.normalize(this.getNodeBranch(this.activeNode).path + p.sep))
      ref.open()
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

    createNewFile(path: string) {
      this.refNewFilePrompt.setDisabled(true)
      this.checkFileExists(path).then((exists) => {
        if (exists) {
          this.refNewFilePrompt.setDisabled(false)
          this.refNewFilePrompt.setError('Path with same name already exists')
        } else {
          this.$sftp.write(path, '').exec({
            onSuccess: () => {
              var parentNode = this.getNodeBranch(this.activeNode)
              if (parentNode.expanded) {
                var leaf = new TreeLeaf(path, parentNode)
                var insertIndex = parentNode.children.findIndex((n) =>
                  n instanceof TreeLeaf && leaf.name.toLowerCase().localeCompare(n.name.toLowerCase()) === -1
                )
                if (insertIndex === -1) insertIndex = parentNode.children.length
                parentNode.children.splice(insertIndex, 0, leaf)
              }
              this.refNewFilePrompt.close()
            },
            onError: (msg) => {
              this.$accessor.alerts.add({
                type: AlertType.Error,
                title: 'Failed to create new file',
                content: msg
              })
            },
            onDone: () => this.refNewFilePrompt.setDisabled(false)
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
              var parentNode = this.getNodeBranch(this.activeNode)
              if (parentNode.expanded) {
                var branch = new TreeBranch(path, parentNode)
                var insertIndex = parentNode.children.findIndex((n) =>
                  n instanceof TreeLeaf || branch.name.toLowerCase().localeCompare(n.name.toLowerCase()) === -1
                )
                if (insertIndex === -1) insertIndex = 0
                parentNode.children.splice(insertIndex, 0, branch)
              }
              this.refNewFolderPrompt.close()
            },
            onError: (msg) => {
              this.$accessor.alerts.add({
                type: AlertType.Error,
                title: 'Failed to create folder',
                content: msg
              })
            },
            onDone: () => this.refNewFolderPrompt.setDisabled(false)
          })
        }
      })
    },

    deletePath(path: string) {
      this.refDeletePathPrompt.setLoading(true)
      this.checkFileExists(path).then((exists) => {
        if (!exists) {
          this.refDeletePathPrompt.setLoading(false)
          this.refDeletePathPrompt.close()
          this.$accessor.alerts.add({
            type: AlertType.Error,
            title: 'Path does not exists'
          })
        } else {
          var cmd: SFTPAction
          switch (exists) {
            case FileInfoType.dir:
              cmd = this.$sftp.rmdir(path)
              break
            case FileInfoType.file:
              cmd = this.$sftp.delete(path)
              break
            case FileInfoType.link:
              return
          }
          cmd.exec({
            onSuccess: () => {
              var parentChildren = this.activeNode.parent?.children
              parentChildren?.splice(parentChildren.findIndex((n) => n.path === path), 1)
            },
            onError: (msg) => {
              // TODO: refresh tree
              this.$accessor.alerts.add({
                type: AlertType.Error,
                title: 'Failed to delete path',
                content: msg
              })
            },
            onDone: () => {
              this.refDeletePathPrompt.setLoading(false)
              this.refDeletePathPrompt.close()
            }
          })
        }
      })
    }
  }
})
</script>
