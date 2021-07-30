import { LSPClient } from 'api/lsp'

type Config = Readonly<{
  pathPrefix: string,
  fileMatch: {
    pattern: string,
    flags: string
  }
}>

export class LSPEntry {

  private _client: LSPClient
  private _config: Config = {
    pathPrefix: '',
    fileMatch: {
      pattern: '',
      flags: ''
    }
  }

  get client() { return this._client }
  get config() { return this._config }

  setConfig(config: Config) {
    if (this._config.pathPrefix !== config.pathPrefix) {
      this._client = new LSPClient(this._client.client, config.pathPrefix)
    }
    this._config = config
  }

  constructor(client: LSPClient) {
    this._client = client
  }

}
