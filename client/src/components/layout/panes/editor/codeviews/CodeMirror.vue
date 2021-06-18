<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter"
import { history, historyKeymap } from "@codemirror/history"
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets"
import { defaultTabBinding } from "@codemirror/commands"
import { oneDark, oneDarkTheme, oneDarkHighlightStyle } from '@codemirror/theme-one-dark'

let tabSize = new Compartment
export default defineComponent({
  data() {
    return {
      view: new EditorView({
        state: EditorState.create({
          extensions: [
            lineNumbers(),
            highlightActiveLineGutter(),
            history(),
            closeBrackets(),
            keymap.of([
              defaultTabBinding,
              ...historyKeymap,
              ...closeBracketsKeymap
            ]),
            oneDark,
            oneDarkTheme,
            oneDarkHighlightStyle,
            tabSize.of(EditorState.tabSize.of(8))
          ]
        })
      })
    }
  },
  mounted() {
    (this.$refs.editor as HTMLElement).appendChild(this.view.dom)
  },
})
</script>

<style>
.cm-wrap {
  height: 100%;
}
</style>
