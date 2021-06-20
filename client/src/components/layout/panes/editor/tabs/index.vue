<template>
  <div class="flex">
    <TabBarItem v-for="[key, tab] in tabs" :key="key" :name="nameFromPath(tab.path)" :isActive="activePath === tab.path"  :isModified="tab.modified" @click="$emit('update:activePath', tab.path)" @close="$emit('closeTab', tab.path)"></TabBarItem>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import p from 'path-browserify'
import { TabItem } from 'types/TabItem.interface'
import TabBarItem from './TabBarItem.vue'

export default defineComponent({
  components: {
   TabBarItem
  },
  props: {
    rootPath: {
      type: String,
      required: true
    },
    tabs: {
      type: Object as PropType<Map<string, TabItem>>,
      required: true
    },
    activePath: {
      type: String,
      required: true
    }
  },
  methods: {
    nameFromPath(path: string): string {
      return p.relative(this.rootPath, path)
    }
  }
})
</script>
