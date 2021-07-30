import { Client } from 'rpc-websockets'
import * as LSP from 'vscode-languageserver-protocol'
import p from 'path-browserify'

interface LSPRequestMap {
  'initialize': [LSP.InitializeParams, LSP.InitializeResult],
  'textDocument/completion': [LSP.CompletionParams, LSP.CompletionItem[] | LSP.CompletionList| null],
  'textDocument/hover': [LSP.HoverParams, LSP.Hover | null]
}

interface LSPNotifyMap {
  'initialized': LSP.InitializedParams,
  'textDocument/didOpen': LSP.DidOpenTextDocumentParams,
  'textDocument/didChange': LSP.DidChangeTextDocumentParams,
  'textDocument/didClose': LSP.DidCloseTextDocumentParams,
  'workspace/didChangeWorkspaceFolders': LSP.DidChangeWorkspaceFoldersParams
}

export class LSPClient {
  private documentVersion = 0
  private _diagnosticListeners = new Map<string, (d: LSP.Diagnostic[]) => void>()
  public serverCapabilities?: LSP.ServerCapabilities

  constructor(public client: Client, public pathPrefix = '') {}

  private resolvePath(path: string): string {
    return 'file://' + p.join(this.pathPrefix + path)
  }

  setDiagnosticsListener(path: string, cb: (d: LSP.Diagnostic[]) => void) {
    console.log(this.resolvePath(path))
    this._diagnosticListeners.set(this.resolvePath(path), cb)
  }

  removeDiagnosticsListener(path: string) {
    console.log(this.resolvePath(path))
    this._diagnosticListeners.delete(this.resolvePath(path))
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

  notifyWorkspaceAdd(name: string, path: string) {
    console.log('add workspace: ' + this.resolvePath(path))
    return this.notify('workspace/didChangeWorkspaceFolders', {
      event: {
        added: [{
          uri: this.resolvePath(path),
          name
        }],
        removed: []
      }
    })
  }

  notifyWorkspaceRemove(name: string, path: string) {
    console.log('remove workspace: ' + this.resolvePath(path))
    return this.notify('workspace/didChangeWorkspaceFolders', {
      event: {
        added: [],
        removed: [{
          uri: this.resolvePath(path),
          name
        }]
      }
    })
  }

  notifyDocOpen(path: string, content: string) {
    console.log('open file: ' + this.resolvePath(path))
    return this.notify('textDocument/didOpen', {
      textDocument: {
        uri: this.resolvePath(path),
        languageId: '',
        text: content,
        version: this.documentVersion
      }
    })
  }

  notifyDocChange(path: string, content: string) {
    console.log('change file: ' + this.resolvePath(path))
    this.documentVersion++
    return this.notify('textDocument/didChange', {
      textDocument: { uri: this.resolvePath(path), version: this.documentVersion },
      contentChanges: [{ text: content }]
    })
  }

  notifyDocClose(path: string) {
    console.log('close file: ' + this.resolvePath(path))
    this.documentVersion = 0
    return this.notify('textDocument/didClose', {
      textDocument: { uri: this.resolvePath(path) }
    })
  }

  requestCompletion(path: string, pos: LSP.Position, ctx: LSP.CompletionContext) {
    return this.request('textDocument/completion', {
      context: ctx,
      textDocument: { uri: this.resolvePath(path) },
      position: pos
    })
  }

  requestHover(path: string, pos: LSP.Position) {
    return this.request('textDocument/hover', {
      textDocument: { uri: this.resolvePath(path) },
      position: pos
    })
  }
}
