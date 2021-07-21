import { Client } from 'rpc-websockets'
import * as LSP from 'vscode-languageserver-protocol'

interface LSPRequestMap {
  'initialize': [LSP.InitializeParams, LSP.InitializeResult]
}

interface LSPNotifyMap {
  'initialized': LSP.InitializedParams,
  'textDocument/didOpen': LSP.DidOpenTextDocumentParams,
  'textDocument/didChange': LSP.DidChangeTextDocumentParams,
  'textDocument/didClose': LSP.DidCloseTextDocumentParams
}

export class LanguageServerClient {
  private documentVersion = 0

  onPublishDiagnostics: (params: LSP.PublishDiagnosticsParams) => void = () =>{}

  constructor(private client: Client) {
    client.subscribe('textDocument/publishDiagnostics')
    client.on('textDocument/publishDiagnostics', this.onPublishDiagnostics)
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
    await this.request('initialize', {
      rootUri: 'file:///',
      processId: null,
      workspaceFolders: [{
        uri: 'file:///',
        name: 'root'
      }],
      capabilities: {

      }
    })
    this.notify('initialized', {})
  }

  notifyDocOpen(uri: string, content: string) {
    this.notify('textDocument/didOpen', {
      textDocument: {
        uri,
        languageId: 'typescript',
        text: content,
        version: this.documentVersion
      }
    })
  }

  notifyDocChange(uri: string, content: string) {
    this.documentVersion++
    this.notify('textDocument/didChange', {
      textDocument: { uri, version: this.documentVersion },
      contentChanges: [{ text: content }]
    })
  }

  notifyDocClose(uri: string) {
    this.documentVersion = 0
    this.notify('textDocument/didClose', {
      textDocument: { uri }
    })
  }
}
