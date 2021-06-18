<template>
  <div>
    <FilePicker v-model:show="showFilePicker" rootName="/" rootPath="/" @done="onSelect" pickFolder/>
    <div class="h-full bg-gray-800 flex flex-col items-center pt-7 gap-5">
      <ProjectBarItem @click="showFilePicker = true">
        <PlusIcon class="w-5 h-5 text-gray-400"/>
      </ProjectBarItem>
      <ProjectBarItem v-for="[key, item] in projects" :key="key" :active="activePath === item.path" @click="setActive(item.path)">
        <p class="text-xl font-mono">{{ letterFromPath(item.path) }}</p>
      </ProjectBarItem>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ProjectItem } from '../../../../types/ProjectItem.class'
import { PlusIcon } from '@zhuowenli/vue-feather-icons'
import ProjectBarItem from './ProjectBarItem.vue'
import FilePicker from '../../FilePicker.vue'

export default defineComponent({
  components: {
    PlusIcon,
    FilePicker,
    ProjectBarItem
  },
  data() {
    return {
      showFilePicker: false
    }
  },
  methods: {
    onSelect(path: string) {
      this.showFilePicker = false
      this.$accessor.projects.add(new ProjectItem(path))
      console.log(this.$accessor.projects.all)
    },
    letterFromPath(path: string): string {
      if (path === '/') return path
      var startIndex = path.lastIndexOf('/') + 1
      return path.substring(startIndex).charAt(0).toUpperCase()
    },
    setActive(path: string) {
      this.$accessor.projects.updateActive(path)
    }
  },
  computed: {
    projects() {
      return this.$accessor.projects.all
    },
    activePath() {
      return this.$accessor.projects.activePath
    }
  },
})
</script>

<style scoped>
</style>
