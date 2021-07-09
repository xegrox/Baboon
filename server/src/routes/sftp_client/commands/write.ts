import Method from '../method'
import jsonrpc from 'jsonrpc-lite'

const method = new Method({
  requireConnection: true,
  params: {
    path: String,
    content: String
  },
  async handler(id, sftp) {
    return sftp.put(Buffer.from(this.content), this.path).then(() => jsonrpc.success(id, null))
  }
})

module.exports = method
