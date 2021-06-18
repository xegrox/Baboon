<template>
  <div class="relative">
    <CodeMirror v-for="[key, item] in tabs" :key="key" v-show="item.path === activePath" class="absolute h-full w-full"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TabItem } from 'types/TabItem.interface'
import CodeMirror from './CodeMirror.vue'

export default defineComponent({
  components: {
    CodeMirror
  },
  props: {
    tabs: {
      type: Object as PropType<Map<string, TabItem>>
    },
    activePath: {
      type: String,
      required: true
    }
  }
})
</script>
