import CodeMirror from 'codemirror'

export interface TabItem {
  path: string
  doc: CodeMirror.Doc
}
