<template>
  <div class="relative bg-opacity-10 bg-white">
    <FadeTransition v-for="[key, item] in tabs" :key="key" class="absolute h-full w-full duration-400">
      <View
        v-show="item.path === activePath"
        class="h-full w-full" :path="item.path"
        :lspClient="lspClient"
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
import { LanguageServerClient } from 'api/lsp'

export default defineComponent({
  components: {
    View,
    FadeTransition
  },
  props: {
    tabs: {
      type: Object as PropType<Map<string, EditorPaneTab>>
    },
    activePath: {
      type: String,
      required: true
    },
    lspServerUrl: {
      type: String,
      required: true
    }
  },
  computed: {
    lspClient(): LanguageServerClient | undefined {
      return this.$accessor.lspservers.all.get(this.lspServerUrl)
    }
  }
})
</script>
