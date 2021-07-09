import Method from '../method'
import jsonrpc from 'jsonrpc-lite'

const method = new Method({
  requireConnection: true,
  params: { path: String },
  async handler(id, sftp) {
    return sftp.delete(this.path).then(() => jsonrpc.success(id, null))
  }
})

module.exports = method
