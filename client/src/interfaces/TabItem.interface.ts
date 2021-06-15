import CodeMirror from 'codemirror'

export default interface Tab {
  path: string
  doc: CodeMirror.Doc
}
