<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AlertType } from 'types/AlertItem.interface'
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import { history, historyKeymap } from '@codemirror/history'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { defaultTabBinding } from '@codemirror/commands'
import { indentOnInput } from '@codemirror/language'
import { theme } from 'assets/js/cm-theme'
import { javascript } from '@codemirror/lang-javascript'

export default defineComponent({
  props: {
    path: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      view: new EditorView({
        state: EditorState.create({
          extensions: [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightActiveLine(),
            history(),
            closeBrackets(),
            indentOnInput(),
            keymap.of([
              defaultTabBinding,
              ...historyKeymap,
              ...closeBracketsKeymap
            ]),
            theme,
            javascript({
              typescript: true
            })
          ]
        })
      })
    }
  },
  mounted() {
    this.$sftp.read(this.path).exec({
      onSuccess: (data: string) => {
        this.view.dispatch({
          changes: {
            from: 0,
            to: this.view.state.doc.length,
            insert: data
          }
        })
      },
      onError: (msg) => {
        this.$accessor.alerts.add({
          type: AlertType.Error,
          title: 'Failed to read file',
          content: msg
        })
      }
    });
    (this.$refs.editor as HTMLElement).appendChild(this.view.dom)
  },
})
</script>

<style>
.cm-wrap {
  height: 100%;
  padding-top: 0.25rem;
}
</style>
