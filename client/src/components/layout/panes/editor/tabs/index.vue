<template>
  <div class="flex">
    <TabBarItem v-for="[key, tab] in tabs" :key="key" :name="tab.path" :isActive="activePath === tab.path"  @click="$emit('update:activePath', tab.path)" @close="$emit('closeTab', tab.path)"></TabBarItem>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TabItem } from '../../../../../types/TabItem.interface'
import TabBarItem from './TabBarItem.vue'

export default defineComponent({
  components: {
   TabBarItem
  },
  props: {
    tabs: {
      type: Object as PropType<Map<string, TabItem>>,
      required: true
    },
    activePath: {
      type: String,
      required: true
    }
  }
})
</script>
