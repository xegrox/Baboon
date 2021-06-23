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
        <FileTreeWrapper ref="tree" :path="slotProps.project.path" :name="slotProps.project.name" @clickItem="onClickItem"/>
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

export default defineComponent({
  components: {
    FileTreeWrapper,
    ProjectWrapper,
    ContextMenu,
    ContextMenuItem
  },
  methods: {
    onClickItem(path: string, isFolder: boolean) {
      if (!isFolder) {
        var projects = this.$accessor.projects
        projects.all.get(projects.activePath)!.addTab(path)
      }
    }
  }
})
</script>
