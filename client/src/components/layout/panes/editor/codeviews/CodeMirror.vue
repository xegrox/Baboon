<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AlertType } from 'types/AlertItem.interface'
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'
import { EditorState, Text } from '@codemirror/state'
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
      view: new EditorView(),
      dbModTimerId: setTimeout(() => {}, 0),
      dbSvTimerId: setTimeout(() => {}, 0),
      initialDoc: Text.empty,
    }
  },
  methods: {
    compareDocEq(doc: Text) {
      return this.initialDoc.length === doc.length && this.initialDoc.eq(doc)
    },
    debounceFunc(id: number, f: Function) {
      clearTimeout(id)
      id = setTimeout(f, 300)
    },
    writeFile(content: string) {
      this.$emit('saving', true)
      this.$sftp.write(this.path, content).exec({
        onSuccess: () => {
          this.initialDoc = this.view.state.doc
          this.$emit('modified', false)
          this.$emit('saving', false)
        },
        onError: (msg) => {
          this.$accessor.alerts.add({
            type: AlertType.Error,
            title: 'Failed to write file',
            content: msg
          })
          this.$emit('saving', false)
        }
      })
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
                  clearTimeout(this.dbModTimerId)
                  this.dbModTimerId = setTimeout(() => this.$emit('modified', !this.compareDocEq(v.state.doc)), 500)
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
              keymap.of([{
                key: 'c-s',
                run: (v) => {
                  clearTimeout(this.dbModTimerId)
                  this.dbSvTimerId = setTimeout(() => this.writeFile(v.state.doc.toString()), 500)
                  return true
                }
              }]),
              theme,
              javascript({
                typescript: true
              })
            ]
          })
        })
        this.initialDoc = view.state.doc
        this.view = view
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
