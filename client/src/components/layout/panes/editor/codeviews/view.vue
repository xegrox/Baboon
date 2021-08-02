<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'
import { EditorState, Text, ChangeSpec, Compartment } from '@codemirror/state'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import { history, historyKeymap } from '@codemirror/history'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { defaultTabBinding, defaultKeymap } from '@codemirror/commands'
import { indentOnInput, LanguageDescription } from '@codemirror/language'
import { setDiagnostics, Diagnostic } from '@codemirror/lint'
import { autocompletion, CompletionContext, CompletionResult, Completion } from '@codemirror/autocomplete'
import { hoverTooltip } from '@codemirror/tooltip'
import { theme } from 'assets/js/cm-theme'
import { languages } from '@codemirror/language-data'
import { LSPWorkspace } from 'api/lsp'
import * as LSP from 'vscode-languageserver-protocol'
import p from 'path-browserify'

export default defineComponent({
  props: {
    savedContents: {
      type: String,
      required: true
    },
    relPath: {
      type: String,
      required: true
    },
    lspWorkspace: Object as PropType<LSPWorkspace>
  },
  data() {
    return {
      view: new EditorView(),
      dbModTimerId: setTimeout(() => {}, 0),
      dbSvTimerId: setTimeout(() => {}, 0),
      dbDSTimerId: setTimeout(() => {}, 0),
      diagnosticHandler: (_p: string, _d: LSP.Diagnostic[]) => {},
      compartment: new Compartment()
    }
  },
  watch: {
    savedContents(contents: string) {
      this.view.dispatch({
        changes: {
          from: 0,
          to: this.view.state.doc.length,
          insert: contents
        }
      })
      this.$emit('modified', false)
    },
    lspWorkspace: {
      immediate: true,
      handler(n?: LSPWorkspace, o?: LSPWorkspace) {
        this.view.dispatch(
          setDiagnostics(this.view.state as EditorState, []), // Reset diagnostics
          {
            effects: this.compartment.reconfigure(autocompletion({
              override: n ? [this.controlCompletion] : undefined // Update completion sources
            }))
          }
        )
        if (o) {
          o.notifyDocClose(this.relPath)
          o.off('diagnostics', this.diagnosticHandler)
        }
        if (n) {
          this.diagnosticHandler = (relPath, diagnostics) => {
            if (this.relPath !== relPath) return
            let transaction = setDiagnostics(this.view.state as EditorState, this.processDiagnostics(diagnostics))
            this.view.dispatch(transaction)
          }
          n.notifyDocOpen(this.relPath, this.view.state.doc.toString())
          n.on('diagnostics', this.diagnosticHandler)
        }
      }
    }
  },
  methods: {
    posToOffset(doc: Text, pos: LSP.Position): number {
      return doc.line(pos.line + 1).from + pos.character
    },
    offsetToPos(doc: Text, offset: number): LSP.Position {
      let line = doc.lineAt(offset)
      return {
        line: line.number - 1,
        character: offset - line.from
      }
    },
    async controlCompletion(ctx: CompletionContext) {
      // There are two types of autocomplete triggers:
      // TriggerCharacter: when a specific character is entered (e.g. '.')
      // Invoked: when typing an identifier or manually invoked (Ctrl + Space)
      let triggerChars = this.lspWorkspace?.capabilities?.completionProvider?.triggerCharacters

      // Determine whether there was a trigger character before the cursor
      // If there is, set trigKind to TriggerCharacter
      // If not, unset trigChar and set trigKind to Invoked
      let trigChar = ctx.matchBefore(/.$/)?.text
      let trigKind: LSP.CompletionTriggerKind = LSP.CompletionTriggerKind.TriggerCharacter
      if (!trigChar) trigKind = LSP.CompletionTriggerKind.Invoked
      if (trigChar && !triggerChars?.includes(trigChar)) {
        if (!ctx.explicit && !trigChar.match(/\w$/)) return null // Return empty if not word char
        trigChar = undefined
        trigKind = LSP.CompletionTriggerKind.Invoked
      }

      await this.lspWorkspace?.notifyDocChange(this.relPath, ctx.state.doc.toString())
      let completion = await this.lspWorkspace?.requestCompletion(
        this.relPath,
        this.offsetToPos(ctx.state.doc, ctx.pos),
        {
          triggerKind: trigKind,
          triggerCharacter: trigChar
        }
      )

      if (!completion) return null
      return this.processCompletion(ctx, completion)
    },
    processDiagnostics(diagnostics: LSP.Diagnostic[]): Diagnostic[] {
      return diagnostics.map<Diagnostic>((d) => ({
        from: this.posToOffset(this.view.state.doc, d.range.start),
        to: this.posToOffset(this.view.state.doc, d.range.end),
        severity: d.severity === LSP.DiagnosticSeverity.Error
          ? 'error'
          : d.severity === LSP.DiagnosticSeverity.Warning
            ? 'warning' : 'info',
        message: d.message
      }))
    },
    processCompletion(ctx: CompletionContext, completion: LSP.CompletionItem[] | LSP.CompletionList): CompletionResult {
      let items = 'items' in completion ? completion.items : completion
      let sortTextSet = new Array<string>()

      let options = items.map<Completion & { sortText: string }>(({
        label,
        sortText,
        insertText,
        textEdit,
        detail,
        documentation
      }) => {
        sortText = sortText ?? label
        if (!sortTextSet.includes(sortText)) sortTextSet.push(sortText)

        // Two types of apply methods are available:
        // insertText: simply insert string at cursor position
        // textEdit:
        //  - TextEdit: replace the text at the given range
        //  - InsertReplaceEdit: unsupported
        // If textEdit is present, insertText is overriden
        let apply = (view: EditorView, _: Completion, from: number, to: number) => {
          let changeSpec: ChangeSpec
          if (textEdit !== undefined && 'range' in textEdit) { // Ignore InsertReplaceEdit
            changeSpec = {
              from: this.posToOffset(view.state.doc, textEdit.range.start),
              to: this.posToOffset(view.state.doc, textEdit.range.end),
              insert: textEdit.newText
            }
          } else {
            let insert = textEdit?.newText ?? insertText ?? label
            changeSpec = { from, to, insert }
          }
          view.dispatch({ changes: changeSpec })
        }

        // TODO: parse markdown in docs
        return {
          label, sortText, apply, detail,
          info: documentation ? this.parseMarkup(documentation) : undefined
        }
      })

      // LSP.CompletionItem.sortText is used to sort the entries. The lower its
      // value, the higher the position of its corresponding option.

      // Since the options are auto sorted during input, a boost value have
      // to be specified. All sortText values in the options are collated in an
      // array then sorted. Then each option's boost value is obtained as the
      // index of its sortText value in the array
      sortTextSet.sort((a, b) => b.localeCompare(a))
      options.forEach((option) => {
        option.boost = sortTextSet.indexOf(option.sortText)
      })

      return {
        from: ctx.matchBefore(/\w*$/)?.from ?? ctx.pos,
        options,
        span: /\w*/
      }
    },
    parseMarkup(content: LSP.MarkupContent | LSP.MarkedString | LSP.MarkedString[] | string): string {
      // TODO: parse markup
      if (typeof content === 'string') return content
      else if (Array.isArray(content)) return content.map((c) => this.parseMarkup(c)).join('\n\n')
      else return content.value
    }
  },
  unmounted() {
    this.lspWorkspace?.notifyDocClose(this.relPath)
    this.lspWorkspace?.off('diagnostics', this.diagnosticHandler)
  },
  async mounted() {
    let language = await LanguageDescription.matchFilename(languages, this.relPath)?.load()
    this.view = new EditorView({
      parent: this.$refs.editor as HTMLElement,
      state: EditorState.create({
        doc: this.savedContents,
        extensions: [
          EditorView.updateListener.of((v) => {
            if (v.docChanged) {
              clearTimeout(this.dbModTimerId)
              this.dbModTimerId = setTimeout(() => {
                let isModified = this.savedContents.length !== v.state.doc.length || this.savedContents !== v.state.doc.toString()
                this.$emit('modified', isModified)
              }, 500)
              clearTimeout(this.dbDSTimerId)
              this.dbDSTimerId = setTimeout(() => this.lspWorkspace?.notifyDocChange(this.relPath, v.state.doc.toString()), 500)
            }
          }),
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          history(),
          closeBrackets(),
          indentOnInput(),
          this.compartment.of(autocompletion()),
          hoverTooltip(async (view, pos) => {
            let hover = await this.lspWorkspace?.requestHover(this.relPath, this.offsetToPos(view.state.doc, pos))
            if (!hover) return null
            let parsed = this.parseMarkup(hover.contents)
            return {
              pos: hover.range ? this.posToOffset(view.state.doc, hover.range.start) : pos,
              end: hover.range ? this.posToOffset(view.state.doc, hover.range.end) : undefined,
              create(_) {
                let dom = document.createElement('div')
                dom.textContent = parsed
                return {
                  dom
                }
              }
            }
          }),
          keymap.of([
            defaultTabBinding,
            ...defaultKeymap,
            ...historyKeymap,
            ...closeBracketsKeymap,
            {
              key: 'c-s',
              run: (v) => {
                clearTimeout(this.dbSvTimerId)
                this.dbSvTimerId = setTimeout(() => this.$emit('save', v.state.doc.toString()), 500)
                return true
              }
            }
          ]),
          theme
        ].concat(language ? language : [])
      })
    })
  }
})
</script>

<style>
.cm-wrap {
  height: 100%;
  padding-top: 0.25rem;
}
</style>
