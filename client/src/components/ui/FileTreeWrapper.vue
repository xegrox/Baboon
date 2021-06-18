<template>
  <FileTree :item="root" v-model:activePath="activePath"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TreeBranch } from 'types/TreeNode.interface'
import FileTree from './FileTree.vue'

export default defineComponent({
  components: {
    FileTree
  },
  props: {
    path: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      root: <TreeBranch>{
        name: this.name,
        path: this.path,
        children: [],
        expanded: false
      },
      activePath: this.path
    }
  }
})
</script>
