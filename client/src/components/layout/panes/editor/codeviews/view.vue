<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'
import { EditorState, Text, ChangeSpec } from '@codemirror/state'
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
import { LSPEntry } from 'types/LSPEntry.class'
import { LSPClient } from 'api/lsp'
import * as LSP from 'vscode-languageserver-protocol'
import p from 'path-browserify'

export default defineComponent({
  props: {
    path: {
      type: String,
      required: true
    },
    lspServerUrls: {
      type: Object as PropType<Set<string>>,
      required: true
    }
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
    lspEntry(): LSPEntry | undefined {
      for (let url of this.lspServerUrls) {
        let entry = this.$accessor.lspclients.all.get(url)
        if (!entry) continue
        let match = entry.config.fileMatch
        if (!match) return entry
        let regex = new RegExp(match.pattern, match.flags)
        if (regex.test(p.basename(this.path))) return entry
      }
      return undefined
    }
  },
  watch: {
    'lspEntry.client': {
      immediate: true,
      handler(n?: LSPClient, o?: LSPClient) {
        this.view.dispatch(setDiagnostics(this.view.state as EditorState, []))
        n?.notifyDocOpen(this.path, this.view.state.doc.toString())
        n?.setDiagnosticsListener(this.path, (diagnostics) => {
          console.log('diag')
          let transaction = setDiagnostics(this.view.state as EditorState, this.processDiagnostics(diagnostics))
          this.view.dispatch(transaction)
        })
        o?.notifyDocClose(this.path)
        o?.removeDiagnosticsListener(this.path)
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
    offsetToPos(doc: Text, offset: number): LSP.Position {
      let line = doc.lineAt(offset)
      return {
        line: line.number - 1,
        character: offset - line.from
      }
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
    this.lspEntry?.client.notifyDocClose(this.path)
    this.lspEntry?.client.removeDiagnosticsListener(this.path)
  },
  mounted() {
    this.$sftp.read(this.path).then(async (content) => {
      let language = await LanguageDescription.matchFilename(languages, this.path)?.load()
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
                this.dbDSTimerId = setTimeout(() => this.lspEntry?.client.notifyDocChange(this.path, v.state.doc.toString()), 500)
              }
            }),
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightActiveLine(),
            history(),
            closeBrackets(),
            indentOnInput(),
            autocompletion({
              override: this.lspEntry ? [async (ctx) => {
                let client = this.lspEntry?.client
                // There are two types of autocomplete triggers:
                // TriggerCharacter: when a specific character is entered (e.g. '.')
                // Invoked: when typing an identifier or manually invoked (Ctrl + Space)
                let triggerChars = client?.serverCapabilities?.completionProvider?.triggerCharacters

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

                await client?.notifyDocChange(this.path, ctx.state.doc.toString())
                let completion = await client?.requestCompletion(
                  this.path,
                  this.offsetToPos(ctx.state.doc, ctx.pos),
                  {
                    triggerKind: trigKind,
                    triggerCharacter: trigChar
                  }
                )

                if (!completion) return null
                return this.processCompletion(ctx, completion)
              }] : undefined
            }),
            hoverTooltip(async (view, pos) => {
              let hover = await this.lspEntry?.client.requestHover(this.path, this.offsetToPos(view.state.doc, pos))
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
                  clearTimeout(this.dbModTimerId)
                  this.dbSvTimerId = setTimeout(() => this.writeFile(v.state.doc.toString()), 500)
                  return true
                }
              }
            ]),
            theme
          ].concat(language ? language : [])
        })
      })
      this.initialDoc = this.view.state.doc
      this.lspEntry?.client.notifyDocChange(this.path, content)
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
