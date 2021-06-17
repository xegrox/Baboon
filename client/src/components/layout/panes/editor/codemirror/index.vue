<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import { ProjectItem } from '../../../../../types/ProjectItem.class'

export default defineComponent({
  props: {
    project: {
      type: Object as PropType<ProjectItem>,
      required: true
    }
  },
  mounted() {
    var doc: CodeMirror.Doc = this.project.tabs.get(this.project.activeTabPath)?.doc ?? this.project.tabs.values().next().value.doc
    CodeMirror(this.$refs.editor as HTMLElement, {
      lineNumbers: true,
      theme: 'monokai',
      value: doc
    })
  },
  computed: {
    codemirror(): CodeMirror.Editor {
      return ((this.$refs.editor as HTMLElement).querySelector('.CodeMirror')! as any).CodeMirror
    }
  },
  watch: {
    'project.activeTabPath': function (newPath: string, oldPath: string) {
      var newTab = this.project.tabs.get(newPath)
      if (!newTab) return
      var oldTab = this.project.tabs.get(oldPath)
      var oldDoc = this.codemirror.swapDoc(newTab.doc)
      if (oldTab) oldTab.doc = oldDoc
    },
  }
})
</script>

<style>
.CodeMirror {
  height: 100%;
}

.CodeMirror * {
  font-size: 0.875rem;
}
</style>
