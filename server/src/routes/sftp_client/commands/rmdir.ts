import Method from '../method'
import jsonrpc from 'jsonrpc-lite'

const method = new Method({
  requireConnection: true,
  params: { path: String },
  async handler(id, sftp) {
    return sftp.rmdir(this.path, true).then(() => jsonrpc.success(id, null))
  }
})

module.exports = method
