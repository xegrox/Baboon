<template>
  <div class="relative">
    <CodeMirror v-for="[key, item] in project.tabs" :key="key" v-show="item.path === project.activeTabPath" class="absolute h-full w-full"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ProjectItem } from '../.../../../../../../types/ProjectItem.class'
import CodeMirror from './CodeMirror.vue'

export default defineComponent({
  components: {
    CodeMirror
  },
  props: {
    project: {
      type: Object as PropType<ProjectItem>,
      required: true
    }
  }
})
</script>

<style lang="css" scoped>
</style>
