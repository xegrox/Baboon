<template>
  <div id="tree" class="flex flex-col bg-gray-900 h-full">
    <div class="flex-none flex h-12 align-bottom items-center pl-5 pr-5">
      <p id="tree_title" class="text-gray-400 font-mono text-sm">File Explorer</p>
    </div>
    <div class="flex-none flex h-10 bg-white align-bottom items-center bg-opacity-5 pl-5 pr-5">
      <p id="tree_title" class="text-gray-200 font-mono truncate text-sm">{{ project.path }}</p>
    </div>
    <div class="flex-1 mt-4 pl-2 pr-2 overflow-auto">
      <FileTree :item="rootBranch" v-model:activePath="activePath"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ProjectItem } from '../../../../types/ProjectItem.class'
import FileTree from '../../../ui/FileTree.vue'
import { TreeBranch } from '../../../../types/TreeNode.interface'

export default defineComponent({
  components: {
    FileTree
  },
  props: {
    project: {
      type: Object as PropType<ProjectItem>,
      required: true
    }
  },
  data() {
    return {
      rootBranch: <TreeBranch>{
        name: this.project.name,
        path: this.project.path,
        expanded: false,
        children: []
      },
      activePath: this.project.path
    }
  }
})
</script>

<style scoped>
</style>
