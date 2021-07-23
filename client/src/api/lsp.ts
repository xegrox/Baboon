import { Client } from 'rpc-websockets'
import * as LSP from 'vscode-languageserver-protocol'

interface LSPRequestMap {
  'initialize': [LSP.InitializeParams, LSP.InitializeResult],
  'textDocument/completion': [LSP.CompletionParams, LSP.CompletionItem[] | LSP.CompletionList| null]
}

interface LSPNotifyMap {
  'initialized': LSP.InitializedParams,
  'textDocument/didOpen': LSP.DidOpenTextDocumentParams,
  'textDocument/didChange': LSP.DidChangeTextDocumentParams,
  'textDocument/didClose': LSP.DidCloseTextDocumentParams,
  'workspace/didChangeWorkspaceFolders': LSP.DidChangeWorkspaceFoldersParams
}

export class LanguageServerClient {
  private documentVersion = 0
  private _diagnosticListeners = new Map<string, (d: LSP.Diagnostic[]) => void>()
  public serverCapabilities?: LSP.ServerCapabilities

  constructor(private client: Client) {}

  setDiagnosticsListener(uri: string, cb: (d: LSP.Diagnostic[]) => void) {
    this._diagnosticListeners.set(uri, cb)
  }

  removeDiagnosticsListener(uri: string) {
    this._diagnosticListeners.delete(uri)
  }

  private request<K extends keyof LSPRequestMap>(method: K, params: LSPRequestMap[K][0])
    : Promise<LSPRequestMap[K][1]> {
    return this.client.call(method, params, 10000) as Promise<LSPRequestMap[K][1]>
  }

  private notify<K extends keyof LSPNotifyMap>(
      method: K,
      params: LSPNotifyMap[K]
  ): Promise<LSPNotifyMap[K]> {
      return this.client.notify(method, params) as Promise<LSPNotifyMap[K]>;
  }

  async initialize() {
    let { capabilities } = await this.request('initialize', {
      rootUri: null,
      processId: null,
      workspaceFolders: [],
      capabilities: {
        workspace: {
          workspaceFolders: true
        },
        textDocument: {
          moniker: {},
          completion: {
            contextSupport: true
          }
        }
      }
    })
    this.serverCapabilities = capabilities
    this.notify('initialized', {})
    this.client.on('textDocument/publishDiagnostics', ((params: LSP.PublishDiagnosticsParams) => {
      this._diagnosticListeners.get(params.uri)?.(params.diagnostics)
    }).bind(this))
  }

  close() {
    this.client.close()
  }

  notifyWorkspaceEdit(changes: LSP.WorkspaceFoldersChangeEvent) {
    return this.notify('workspace/didChangeWorkspaceFolders', {
      event: changes
    })
  }

  notifyDocOpen(uri: string, content: string) {
    return this.notify('textDocument/didOpen', {
      textDocument: {
        uri,
        languageId: '',
        text: content,
        version: this.documentVersion
      }
    })
  }

  notifyDocChange(uri: string, content: string) {
    this.documentVersion++
    return this.notify('textDocument/didChange', {
      textDocument: { uri, version: this.documentVersion },
      contentChanges: [{ text: content }]
    })
  }

  notifyDocClose(uri: string) {
    this.documentVersion = 0
    return this.notify('textDocument/didClose', {
      textDocument: { uri }
    })
  }

  requestCompletion(uri: string, pos: LSP.Position, ctx: LSP.CompletionContext) {
    return this.request('textDocument/completion', {
      context: ctx,
      textDocument: { uri },
      position: pos
    })
  }
}
