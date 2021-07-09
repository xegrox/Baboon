import Method from '../method'
import jsonrpc from 'jsonrpc-lite'

const method = new Method({
  requireConnection: true,
  params: { path: String },
  async handler(id, sftp) {
    return sftp.get(this.path).then((buf) => jsonrpc.success(id, buf.toString()))
  }
})

module.exports = method
