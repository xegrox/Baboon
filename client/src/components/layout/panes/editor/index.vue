<template>
  <ProjectWrapper v-slot="slotProps">
    <div class="flex flex-col">
      <Tabs
        class="flex-none h-12"
        :rootPath="slotProps.project.path"
        :tabs="slotProps.project.editorPaneTabs.all"
        v-model:activeRelPath="slotProps.project.editorPaneTabs.active"
        @closeTab="slotProps.project.editorPaneTabs.remove($event)"
      />
      <CodeViews
        class="flex-1"
        :rootPath="slotProps.project.path"
        :tabs="slotProps.project.editorPaneTabs.all"
        :activeRelPath="slotProps.project.editorPaneTabs.active"
        :lspWorkspaces="slotProps.project.lspWorkspaces"
      />
    </div>
  </ProjectWrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tabs from './tabs/index.vue'
import CodeViews from './codeviews/index.vue'
import ProjectWrapper from 'components/layout/panes/ProjectWrapper.vue'

export default defineComponent({
  components: {
    Tabs,
    CodeViews,
    ProjectWrapper
  }
})
</script>
