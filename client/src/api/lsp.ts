import { Client } from 'rpc-websockets'
import { EventEmitter } from 'events';
import LSP from 'vscode-languageserver-protocol'
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

interface LSPEventMap {
  'textDocument/publishDiagnostics': LSP.PublishDiagnosticsParams
}

class LSPBus {
  constructor(private client: Client) {}

  public request<K extends keyof LSPRequestMap>(method: K, params: LSPRequestMap[K][0])
    : Promise<LSPRequestMap[K][1]> {
    return this.client.call(method, params, 10000) as Promise<LSPRequestMap[K][1]>
  }

  public notify<K extends keyof LSPNotifyMap>(
      method: K,
      params: LSPNotifyMap[K]
  ) {
      return this.client.notify(method, params)
  }

  public on<K extends keyof LSPEventMap>(
    event: K,
    fn: (params: LSPEventMap[K]) => void
  ) {
    this.client.on(event, fn)
  }
}

function pathToUri(path: string): string {
  return 'file://' + p.normalize(path)
}

function uriToPath(uri: string): string {
  return uri.replace(/^file:\/\//, '')
}

export type LSPConfig = {
  pathPrefix: string,
  fileMatch: {
    pattern: string,
    flags: string
  }
}

export class LSPClient {
  private bus: LSPBus
  // Key is path of workspace without prefix
  private _workspaces = new Map<string, LSPWorkspace>()
  public capabilities!: Readonly<LSP.ServerCapabilities>

  private _config: LSPConfig = {
    pathPrefix: '',
    fileMatch: {
      pattern: '',
      flags: ''
    }
  }

  constructor(public client: Client) {
    this.bus = new LSPBus(client)
  }

  get config(): Readonly<LSPConfig> { return this._config }
  get workspaces(): ReadonlyMap<string, LSPWorkspace> { return this._workspaces }

  async initialize() {
    let { capabilities } = await this.bus.request('initialize', {
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
    this.bus.notify('initialized', {})
    this.capabilities = capabilities
    this.bus.on('textDocument/publishDiagnostics', (params) => {
      this.workspaces.forEach((workspace) => {
        if (params.uri.startsWith(pathToUri(workspace.fullPath))) {
          let relPath = p.relative(workspace.fullPath, uriToPath(params.uri))
          workspace.emit('diagnostics', relPath, params.diagnostics)
        }
      })
    })
  }

  // There should only be one workspace assigned per path
  async addWorkspace(name: string, path: string): Promise<LSPWorkspace> {
    let workspace = this.workspaces.get(path)
    if (workspace) return workspace
    let fileMatch = RegExp(this.config.fileMatch.pattern, this.config.fileMatch.flags)
    workspace = new LSPWorkspace(this.bus, this.capabilities, name, path, this.config.pathPrefix, fileMatch)
    await workspace.open()
    this._workspaces.set(path, workspace)
    return workspace
  }

  async removeWorkspace(path: string) {
    let workspace = this.workspaces.get(path)
    if (workspace) {
      await workspace.close()
      this._workspaces.delete(path)
    }
  }

  async setConfig(config: LSPConfig) {
    for (let workspace of this.workspaces.values()) {
      if (config.pathPrefix !== this.config.pathPrefix) {
        await workspace.close()
        workspace.pathPrefix = config.pathPrefix
        await workspace.open()
      }
      workspace.fileMatch = RegExp(config.fileMatch.pattern, config.fileMatch.flags)
    }
    this._config = config
  }
}

interface LSPWorkspaceEventMap {
  'diagnostics': [string, LSP.Diagnostic[]]
}

export class LSPWorkspace extends EventEmitter {
  private isOpen = false
  private modifyCount = 0

  // Path of open docs relative to fullPath
  private _openDocs = new Set<string>()
  get openDocs(): ReadonlySet<string> { return this._openDocs }
  get fullPath(): string { return p.join(this.pathPrefix, this.path) }

  constructor(
    private bus: LSPBus,
    public capabilities: Readonly<LSP.ServerCapabilities>,
    public name: string,
    public path: string,
    public pathPrefix: string,
    public fileMatch: RegExp) {
    super()
  }

  private resolvePath(relPath: string) {
    return p.join(this.pathPrefix, this.path, relPath)
  }

  override emit<K extends keyof LSPWorkspaceEventMap>(
    event: K,
    ...params: LSPWorkspaceEventMap[K]
  ) {
    return super.emit(event, ...params)
  }

  override on<K extends keyof LSPWorkspaceEventMap>(
    event: K,
    fn: (...params: LSPWorkspaceEventMap[K]) => void
  ) {
    return super.on(event, fn as (...args: any[]) => void)
  }

  notifyDocOpen(relPath: string, contents: string) {
    if (!this._openDocs.has(relPath)) {
      this._openDocs.add(relPath)
      return this.bus.notify('textDocument/didOpen', {
        textDocument: {
          languageId: '',
          uri: pathToUri(this.resolvePath(relPath)),
          text: contents,
          version: this.modifyCount
        }
      })
    }
  }

  notifyDocChange(relPath: string, contents: string) {
    if (this._openDocs.has(relPath)) {
      return this.bus.notify('textDocument/didChange', {
        contentChanges: [{ text: contents }],
        textDocument: {
          uri: pathToUri(this.resolvePath(relPath)),
          version: ++this.modifyCount
        }
      })
    }
  }

  notifyDocClose(relPath: string) {
    if (this._openDocs.delete(relPath)) {
      return this.bus.notify('textDocument/didClose', {
        textDocument: { uri: pathToUri(this.resolvePath(relPath)) }
      })
    }
  }


  requestCompletion(relPath: string, pos: LSP.Position, ctx: LSP.CompletionContext) {
    return this.bus.request('textDocument/completion', {
      context: ctx,
      textDocument: { uri: pathToUri(this.resolvePath(relPath)) },
      position: pos
    })
  }

  requestHover(relPath: string, pos: LSP.Position) {
    return this.bus.request('textDocument/hover', {
      textDocument: { uri: pathToUri(this.resolvePath(relPath)) },
      position: pos
    })
  }

  async open() {
    if (!this.isOpen) {
      // Open workspace
      await this.bus.notify('workspace/didChangeWorkspaceFolders', {
        event: {
          added: [{
            name: this.name,
            uri: pathToUri(this.fullPath)
          }],
          removed: []
        }
      })
      this.isOpen = true
    }
  }

  async close() {
    if (this.isOpen) {
      // Close all files before closing workspace
      for (let path of this.openDocs) {
        await this.notifyDocClose(path)
      }
      // Close workspace
      await this.bus.notify('workspace/didChangeWorkspaceFolders', {
        event: {
          removed: [{
            name: this.name,
            uri: pathToUri(this.fullPath)
          }],
          added: []
        }
      })
      this.isOpen = false
    }
  }
}
