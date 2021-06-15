<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

export default defineComponent({
  mounted() {
    CodeMirror(this.$refs.editor as HTMLElement, {
      lineNumbers: true,
      theme: 'monokai',
    })
  },
  computed: {
    codemirror(): CodeMirror.Editor {
      return ((this.$refs.editor as HTMLElement).querySelector('.CodeMirror')! as any).CodeMirror
    },
    activeIndex() {
      return this.$accessor.tabs.activeIndex
    }
  },
  watch: {
    activeIndex: function(newIndex: number, oldIndex: number) {

      var newDoc = this.$accessor.tabs.all[newIndex].doc
      this.$accessor.tabs.updateDoc({
        index: oldIndex,
        doc: this.codemirror.swapDoc(newDoc)
      })
    }
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
