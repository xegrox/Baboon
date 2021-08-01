<template>
  <div>
    <FileTree :rootPath="rootPath" :node="rootBranch" :activeNode="activeNode" :allowFile="allowFile" :allowFolder="allowFolder" @rightClickNode="onRightClickNode" @clickNode="onClickNode"/>
    <ContextMenu ref="ctxmenu">
      <ContextMenuItem text="New file" shortcut="A" @click="openInputPathDialog(refNewFilePrompt)"/>
      <ContextMenuItem text="New folder" shortcut="Shift+A" @click="openInputPathDialog(refNewFolderPrompt)"/>
      <ContextMenuItem text="Delete" shortcut="Backspace" @click="refDeletePathPrompt.open()"/>
    </ContextMenu>
    <InputPrompt ref="newFilePrompt" placeholder="Path to new file" @enter="createNewFile"/>
    <InputPrompt ref="newFolderPrompt" placeholder="Path to new folder" @enter="createNewFolder"/>
    <ActionDialog ref="deletePathPrompt" message="Are you sure you want to permanently delete the selected item?" actionText="Delete" @positive="deletePath(activeNode.relPath)"/>
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
    rootPath: {
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
    let basename = p.basename(this.rootPath)
    if (basename === '') basename = '/'
    let rootBranch = new TreeBranch(
      basename,
      p.normalize(this.rootPath) === '/' ? '/' : '',
      undefined
    )
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
    onRightClickNode(node: TreeNode, event: MouseEvent) {
      this.activeNode = node
      var menu = this.$refs.ctxmenu as any
      menu.setPos(event.x, event.y)
      menu.open()
      this.$emit('rightClickNode', node, event)
    },

    onClickNode(node: TreeNode, event: MouseEvent) {
      this.activeNode = node
      this.$emit('activeRelPathUpdate', node.relPath)
      this.$emit('clickNode', node, event)
    },

    getNodeBranch(node: TreeNode): TreeBranch {
      // Returns the node's parent or the node itself if it is a branch
      return (node instanceof TreeLeaf) ? node.parent : node as TreeBranch
    },

    openInputPathDialog(ref: any) {
      let relPath = this.getNodeBranch(this.activeNode).relPath
      ref.setValue(relPath !== '' ? p.normalize(relPath + p.sep) : relPath)
      ref.open()
    },

    createNewFile(relPath: string) {
      let fullPath = p.join(this.rootPath, relPath)
      this.refNewFilePrompt.setDisabled(true)
      this.$sftp.exists(fullPath).then((exists) => {
        if (exists) {
          // Display error is path exists
          this.refNewFilePrompt.setDisabled(false)
          this.refNewFilePrompt.setError('Path with same name already exists')
        } else {
          // Write new empty file
          this.$sftp.write(fullPath, '').then(() => {
            var parentNode = this.getNodeBranch(this.activeNode)
            // Insert new leaf node if branch is expanded
            if (parentNode.expanded) {
              var leaf = new TreeLeaf(p.basename(relPath), relPath, parentNode)
              var insertIndex = parentNode.children.findIndex((n) => {
                // Get index of the leaf node positioned after it
                n instanceof TreeLeaf && leaf.name.toLowerCase().localeCompare(n.name.toLowerCase()) === -1
              })
              // If there's none, insert at the end
              if (insertIndex === -1) insertIndex = parentNode.children.length
              parentNode.children.splice(insertIndex, 0, leaf)
            }
            this.refNewFilePrompt.close()
          }).catch(() => {})
        }
      }).catch(() => {}).finally(() => this.refNewFilePrompt.setDisabled(false))
    },

    createNewFolder(relPath: string) {
      let fullPath = p.join(this.rootPath, relPath)
      this.refNewFolderPrompt.setDisabled(true)
      this.$sftp.exists(fullPath).then((exists) => {
        if (exists) {
          // Display error if path exists
          this.refNewFolderPrompt.setDisabled(false)
          this.refNewFolderPrompt.setError('Path with same name already exists')
        } else {
          // Creat new dir
          this.$sftp.mkdir(fullPath).then(() => {
            var parentNode = this.getNodeBranch(this.activeNode)
            // Insert new branch node if branch is expanded
            if (parentNode.expanded) {
              var branch = new TreeBranch(p.basename(relPath), relPath, parentNode)
              var insertIndex = parentNode.children.findIndex((n) => {
                // Get index of the node positioned after it
                n instanceof TreeLeaf // Branches are positioned before leafs
                || branch.name.toLowerCase().localeCompare(n.name.toLowerCase()) === -1
              })
              // If there's none, insert at the end
              if (insertIndex === -1) insertIndex = parentNode.children.length
              parentNode.children.splice(insertIndex, 0, branch)
            }
            this.refNewFolderPrompt.close()
          }).catch(() => {}).finally(() => this.refNewFolderPrompt.setDisabled(false))
        }
      }).catch(() => {})
    },

    deletePath(relPath: string) {
      let fullPath = p.join(this.rootPath, relPath)
      this.refDeletePathPrompt.setLoading(true)
      this.$sftp.exists(fullPath).then((exists) => {
        if (!exists) {
          this.refDeletePathPrompt.setLoading(false)
          this.refDeletePathPrompt.close()
          this.$accessor.alerts.add({
            type: AlertType.Error,
            title: 'Path does not exists'
          })
        } else {
          var cmd: (path: string) => Promise<null>
          switch (exists) {
            case FileInfoType.dir:
              cmd = this.$sftp.rmdir
              break
            case FileInfoType.file:
              cmd = this.$sftp.delete
              break
            case FileInfoType.link:
              // TODO: support link delete
              return
          }
          cmd(fullPath).then(() => {
            // Remove deleted file's node
            var parentChildren = this.activeNode.parent?.children
            parentChildren?.splice(parentChildren.indexOf(this.activeNode), 1)
          }).catch(() => {}).finally(() => {
            this.refDeletePathPrompt.setLoading(false)
            this.refDeletePathPrompt.close()
          })
        }
      }).catch(() => {})
    }
  }
})
</script>
