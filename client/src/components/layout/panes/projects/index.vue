<template>
  <div>
    <FilePicker ref="filepicker" rootName="/" rootPath="/" @done="onSelect" pickFolder/>
    <div class="h-full bg-gray-800 flex flex-col items-center pt-7 gap-5">
      <ProjectBarItem @click="$refs.filepicker.open()">
        <PlusIcon class="w-5 h-5 text-gray-400"/>
      </ProjectBarItem>
      <ProjectBarItem v-for="[key, item] in projects" :key="key" :active="activePath === item.path" @click="setActive(item.path)" @close="this.$accessor.projects.remove(key)">
        <p class="text-xl font-mono">{{ item.name.charAt(0).toUpperCase() }}</p>
      </ProjectBarItem>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ProjectItem } from 'types/ProjectItem.class'
import { PlusIcon } from '@zhuowenli/vue-feather-icons'
import ProjectBarItem from './ProjectBarItem.vue'
import FilePicker from 'components/layout/FilePicker.vue'

export default defineComponent({
  components: {
    PlusIcon,
    FilePicker,
    ProjectBarItem
  },
  methods: {
    onSelect(path: string) {
      var name = path !== '/' ? path.substring(path.lastIndexOf('/') + 1) : path
      this.$accessor.projects.add(new ProjectItem(name, path))
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
