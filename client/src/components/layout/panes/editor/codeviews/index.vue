<template>
  <div class="relative bg-opacity-10 bg-white">
    <FadeTransition v-for="[key, item] in tabs" :key="key" class="absolute h-full w-full duration-400">
      <View
        class="h-full w-full"
        v-show="item.relPath === activeRelPath"
        :relPath="item.relPath"
        :savedContents="item.savedContents"
        :lspWorkspace="matchWorkspace(item.relPath)"
        @modified="item.modified = $event"
        @save="writeFile(item, $event)"/>
    </FadeTransition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EditorPaneTab } from 'types/ProjectItem.class'
import FadeTransition from 'components/ui/transitions/Fade.vue'
import { LSPWorkspace } from 'api/lsp'
import View from './view.vue'
import p from 'path-browserify'

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
    rootPath: {
      type: String,
      required: true
    },
    activeRelPath: {
      type: String,
      required: true
    },
    lspWorkspaces: {
      type: Object as PropType<Map<string, LSPWorkspace>>,
      required: true
    }
  },
  methods: {
    writeFile(item: EditorPaneTab, contents: string) {
      let fullPath = p.join(this.rootPath, item.relPath)
      item.saving = true
      this.$sftp.write(fullPath, contents).then(() => {
        item.savedContents = contents
      }).catch(() => {}).finally(() => item.saving = false)
    },

    matchWorkspace(relPath: string): LSPWorkspace | undefined {
      let name = p.basename(relPath)
      for (let workspace of this.lspWorkspaces.values()) {
        if (workspace.fileMatch.test(name)) return workspace
      }
      return undefined
    }
  }
})
</script>
