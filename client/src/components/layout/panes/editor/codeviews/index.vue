<template>
  <div class="relative bg-opacity-10 bg-white">
    <FadeTransition v-for="[key, item] in tabs" :key="key" class="absolute h-full w-full duration-400">
      <View
        v-show="item.path === activePath"
        class="h-full w-full" :path="item.path"
        :lspServerUrls="lspServerUrls"
        @modified="item.modified = $event"
        @saving="item.saving = $event"/>
    </FadeTransition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EditorPaneTab } from 'types/ProjectItem.class'
import View from './view.vue'
import FadeTransition from 'components/ui/transitions/Fade.vue'

export default defineComponent({
  components: {
    View,
    FadeTransition
  },
  props: {
    tabs: {
      type: Object as PropType<ReadonlyMap<string, EditorPaneTab>>,
      required: true
    },
    activePath: {
      type: String,
      required: true
    },
    lspServerUrls: {
      type: Object as PropType<Set<string>>,
      required: true
    }
  }
})
</script>
