<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AlertType } from 'types/AlertItem.interface'
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'
import { EditorState, Text, Transaction } from '@codemirror/state'
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
      dbTimerId: setTimeout(() => {}, 0),
      initialDoc: Text.empty,
    }
  },
  methods: {
    compareDocEq(doc: Text) {
      return this.initialDoc.length === doc.length || this.initialDoc.eq(doc)
    },
    debounceFunc(f: Function) {
      clearTimeout(this.dbTimerId)
      this.dbTimerId = setTimeout(f, 200)
    }
  },
  mounted() {
    this.$sftp.read(this.path).exec({
      onSuccess: (data: string) => {
        var view = new EditorView({
          parent: this.$refs.editor as HTMLElement,
          state: EditorState.create({
            doc: data,
            extensions: [
              EditorView.updateListener.of((v) => {
                if (v.docChanged) {
                  this.debounceFunc(() => this.$emit('modified', !this.compareDocEq(v.state.doc)))
                }
              }),
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
        this.initialDoc = view.state.doc
      },
      onError: (msg) => {
        this.$accessor.alerts.add({
          type: AlertType.Error,
          title: 'Failed to read file',
          content: msg
        })
      }
    });
  },
})
</script>

<style>
.cm-wrap {
  height: 100%;
  padding-top: 0.25rem;
}
</style>
