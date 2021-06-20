<template>
  <ProjectWrapper v-slot="slotProps">
    <div class="flex flex-col">
      <Tabs :rootPath="slotProps.project.path" :tabs="slotProps.project.tabs" :activePath="slotProps.project.activeTabPath" @update:activePath="slotProps.project.updateActiveTab($event)" @closeTab="slotProps.project.removeTab($event)" class="flex-none h-12"/>
      <CodeViews :tabs="slotProps.project.tabs" :activePath="slotProps.project.activeTabPath" class="flex-1"/>
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
