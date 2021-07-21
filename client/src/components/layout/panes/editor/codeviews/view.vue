<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'
import { EditorState, Text } from '@codemirror/state'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import { history, historyKeymap } from '@codemirror/history'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { defaultTabBinding } from '@codemirror/commands'
import { indentOnInput } from '@codemirror/language'
import { setDiagnostics, Diagnostic } from '@codemirror/lint'
import { theme } from 'assets/js/cm-theme'
import { javascript } from '@codemirror/lang-javascript'
import { LanguageServerClient } from 'api/lsp'
import * as LSP from 'vscode-languageserver-protocol'

export default defineComponent({
  props: {
    path: {
      type: String,
      required: true
    },
    lspClient: Object as PropType<LanguageServerClient>
  },
  data() {
    return {
      view: new EditorView(),
      dbModTimerId: setTimeout(() => {}, 0),
      dbSvTimerId: setTimeout(() => {}, 0),
      dbDSTimerId: setTimeout(() => {}, 0),
      initialDoc: Text.empty,
    }
  },
  computed: {
    pathUri(): string {
      return 'file://' + this.path
    }
  },
  watch: {
    lspClient: {
      immediate: true,
      handler(n?: LanguageServerClient, o?: LanguageServerClient) {
        n?.notifyDocOpen(this.pathUri, this.view.state.doc.toString())
        n?.setDiagnosticsListener(this.pathUri, this.handleDiagnostics)
        o?.notifyDocClose(this.pathUri)
        o?.removeDiagnosticsListener(this.pathUri)
      }
    }
  },
  methods: {
    compareDocEq(doc: Text) {
      return this.initialDoc.length === doc.length && this.initialDoc.eq(doc)
    },
    writeFile(content: string) {
      this.$emit('saving', true)
      this.$sftp.write(this.path, content).then(() => {
        this.initialDoc = this.view.state.doc
        this.$emit('modified', false)
      }).catch(() => {}).finally(() => this.$emit('saving', false))
    },
    posToOffset(doc: Text, pos: LSP.Position): number {
      return doc.line(pos.line + 1).from + pos.character
    },
    handleDiagnostics(diagnostics: LSP.Diagnostic[]) {
      let transaction = setDiagnostics(this.view.state as EditorState, diagnostics.map<Diagnostic>((d) => ({
        from: this.posToOffset(this.view.state.doc, d.range.start),
        to: this.posToOffset(this.view.state.doc, d.range.end),
        severity: d.severity === LSP.DiagnosticSeverity.Error
          ? 'error'
          : d.severity === LSP.DiagnosticSeverity.Warning
            ? 'warning' : 'info',
        message: d.message
      })))
      this.view.dispatch(transaction)
    }
  },
  unmounted() {
    this.lspClient?.notifyDocClose(this.pathUri)
    this.lspClient?.removeDiagnosticsListener(this.pathUri)
  },
  mounted() {
    this.$sftp.read(this.path).then((content) => {
      this.view = new EditorView({
        parent: this.$refs.editor as HTMLElement,
        state: EditorState.create({
          doc: content,
          extensions: [
            EditorView.updateListener.of((v) => {
              if (v.docChanged) {
                clearTimeout(this.dbModTimerId)
                this.dbModTimerId = setTimeout(() => this.$emit('modified', !this.compareDocEq(v.state.doc)), 500)
                clearTimeout(this.dbDSTimerId)
                this.dbDSTimerId = setTimeout(() => this.lspClient?.notifyDocChange('file://' + this.path, v.state.doc.toString()), 500)
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
      this.initialDoc = this.view.state.doc
      this.lspClient?.notifyDocChange(this.pathUri, content)
    }).catch(() => {})
  }
})
</script>

<style>
.cm-wrap {
  height: 100%;
  padding-top: 0.25rem;
}
</style>
