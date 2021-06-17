<template>
  <div class="flex">
    <TabBarItem v-for="[key, tab] in project.tabs" :key="key" :name="tab.path" :isActive="project.activeTabPath === tab.path"  @click="updateActive(key)" @close="removeTab(key)"></TabBarItem>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ProjectItem } from '../../../../../types/ProjectItem.class'
import TabBarItem from './TabBarItem.vue'

export default defineComponent({
  components: {
   TabBarItem
  },
  props: {
    project: {
      type: Object as PropType<ProjectItem>,
      required: true
    }
  },
  methods: {
    updateActive(path: string) {
      this.project.updateActiveTab(path)
    },
    removeTab(path: string) {
      this.project.removeTab(path)
    }
  }
})
</script>

<style scoped>
</style>
