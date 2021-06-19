<template>
  <div class="relative bg-opacity-10 bg-white">
    <FadeTransition v-for="[key, item] in tabs" :key="key" class="absolute h-full w-full duration-400">
      <CodeMirror v-show="item.path === activePath" class="h-full w-full" :path="item.path"/>
    </FadeTransition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TabItem } from 'types/TabItem.interface'
import CodeMirror from './CodeMirror.vue'
import FadeTransition from 'components/ui/transitions/Fade.vue'

export default defineComponent({
  components: {
    CodeMirror,
    FadeTransition
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
