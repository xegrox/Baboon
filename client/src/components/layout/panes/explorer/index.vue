<template>
  <div class="flex flex-col bg-gray-900 h-full">
    <div class="flex-none flex h-12 align-bottom items-center pl-5 pr-5">
      <p class="text-gray-400 font-mono text-sm">File Explorer</p>
    </div>
    <ProjectWrapper v-slot="slotProps" class="flex-none h-10 bg-white bg-opacity-5">
      <div class="flex h-full align-bottom items-center pl-5 pr-5">
        <p class="text-gray-200 font-mono truncate text-sm">{{ slotProps.project.path }}</p>
      </div>
    </ProjectWrapper>
    <ProjectWrapper v-slot="slotProps" class="flex-1 mt-4">
      <div class="pl-2 pr-2 overflow-auto">
        <FileTreeWrapper
          ref="tree"
          :rootPath="slotProps.project.path"
          @clickNode="onClickNode(slotProps.project.path, $event)"/>
      </div>
    </ProjectWrapper>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FileTreeWrapper from 'components/ui/FileTreeWrapper.vue'
import ProjectWrapper from 'components/layout/panes/ProjectWrapper.vue'
import ContextMenu from 'components/ui/ContextMenu.vue'
import ContextMenuItem from 'components/ui/ContextMenuItem.vue'
import { TreeNode, TreeLeaf } from 'types/TreeNode.class'
import p from 'path-browserify'

export default defineComponent({
  components: {
    FileTreeWrapper,
    ProjectWrapper,
    ContextMenu,
    ContextMenuItem
  },
  methods: {
    onClickNode(rootPath: string, node: TreeNode) {
      if (node instanceof TreeLeaf) {
        let fullPath = p.join(rootPath, node.relPath)
        this.$sftp.read(fullPath).then((contents) => {
          this.$accessor.projects.active?.editorPaneTabs.add(node.relPath, {
            relPath: node.relPath,
            savedContents: contents,
            modified: false,
            saving: false
          })
        }).catch(() => {})

      }
    }
  }
})
</script>
