import Method from '../method'
import jsonrpc from 'jsonrpc-lite'

const method = new Method({
  requireConnection: true,
  params: { path: String },
  async handler(id, sftp) {
    return sftp.exists(this.path).then((exists) => jsonrpc.success(id, exists))
  }
})

module.exports = method
