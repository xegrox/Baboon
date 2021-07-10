import Method from '../method'
import jsonRpc from 'jsonrpc-lite'
import store from 'store/clients'

const method = new Method({
  requireConnection: true,
  async handler(id, sftp) {
    try {
      await sftp.end()
    } catch(_) {} // Ignore any errors
    store.delete(this.sessionId)
    return jsonRpc.success(id, null)
  }
})

module.exports = method
