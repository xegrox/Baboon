<template>
  <div class="relative">
    <div v-for="[key, project] in projects" :key="key" class="w-full h-full" v-show="isActive(project.path)" :class="{ 'pointer-events-none': !isActive(project.path) }">
      <slot :project="project" :shown="isActive(project.path)"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  computed: {
    projects() {
      return this.$accessor.projects.all
    },
  },
  methods: {
    isActive(path: string) {
      return this.$accessor.projects.activePath === path
    }
  }
})
</script>

<style lang="css" scoped>
</style>
