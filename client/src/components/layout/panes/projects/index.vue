<template>
  <div>
    <FilePicker v-model:show="showFilePicker" rootName="/" rootPath="/" @done="showFilePicker = false" pickFolder/>
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
import { PlusIcon } from '@zhuowenli/vue-feather-icons'
import ProjectBarItem from './ProjectBarItem.vue'
import FilePicker from '../../FilePicker.vue'

export default defineComponent({
  components: {
    PlusIcon,
    FilePicker,
    ProjectBarItem
  },
  computed: {
    projects() {
      return this.$accessor.projects.all
    },
    activePath() {
      return this.$accessor.projects.activePath
    }
  },
  methods: {
    letterFromPath: (path: string): string => path.substring(path.lastIndexOf('/')).charAt(0).toUpperCase(),
    setActive(path: string) {
      this.$accessor.projects.updateActive(path)
    }
  },
  data() {
    return {
      showFilePicker: false
    }
  }
})
</script>

<style scoped>
</style>
