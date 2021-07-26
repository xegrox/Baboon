<template>
  <div>
    <FilePicker ref="filepicker" rootName="/" rootPath="/" @done="onSelect($event)" pickFolder/>
    <div class="h-full bg-gray-800 flex flex-col items-center pt-7 gap-5">
      <Item @click="openFilePicker()">
        <PlusIcon class="w-5 h-5 text-gray-400"/>
      </Item>
      <Item v-for="[key, item] in projects" :key="key" :active="activePath === item.path" @click="setActive(item.path)" @close="$accessor.projects.remove(key)">
        <p class="text-xl font-mono">{{ item.name.charAt(0).toUpperCase() }}</p>
      </Item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ProjectItem } from 'types/ProjectItem.class'
import { PlusIcon } from '@zhuowenli/vue-feather-icons'
import Item from './item.vue'
import FilePicker from 'components/layout/FilePicker.vue'

export default defineComponent({
  components: {
    PlusIcon,
    FilePicker,
    Item
  },
  methods: {
    openFilePicker() {
      (this.$refs.filepicker as any).open()
    },
    onSelect(path: string) {
      var name = path !== '/' ? path.substring(path.lastIndexOf('/') + 1) : path
      this.$accessor.projects.add(new ProjectItem(name, path))
    },
    setActive(path: string) {
      this.$accessor.projects.updateActive(path)
    }
  },
  computed: {
    projects(): Map<string, ProjectItem> {
      return this.$accessor.projects.all
    },
    activePath(): string {
      return this.$accessor.projects.activePath
    }
  }
})
</script>
