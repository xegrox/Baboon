<template>
  <ProjectWrapper v-slot="slotProps">
    <div class="flex flex-col">
      <Tabs
        :rootPath="slotProps.project.path"
        :tabs="slotProps.project.editorPaneTabs.all"
        :activePath="slotProps.project.editorPaneTabs.active"
        @update:activePath="slotProps.project.editorPaneTabs.active = $event"
        @closeTab="slotProps.project.editorPaneTabs.remove($event)" class="flex-none h-12"
      />
      <CodeViews :tabs="slotProps.project.editorPaneTabs.all" :activePath="slotProps.project.editorPaneTabs.active" class="flex-1"/>
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
