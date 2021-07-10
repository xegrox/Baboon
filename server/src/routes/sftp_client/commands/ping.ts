import Method from '../method'
import jsonrpc from 'jsonrpc-lite'
import store from 'store/clients'

// Returns a status code
// -1 : No sftp session found
// 0 : Sftp session found but not connected
// 1 : Sftp session found and connected

const method = new Method({
  async handler(id) {
    let sftp = store.get(this.sessionId)
    let haveConnection = require('ssh2-sftp-client/src/utils').haveConnection
    let code = sftp ?
      haveConnection(sftp) ? 1 : 0
      : -1
    return jsonrpc.success(id, code)
  }
})

module.exports = method
