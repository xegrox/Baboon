import Method from '../method'
import jsonrpc from 'jsonrpc-lite'

const method = new Method({
  requireConnection: true,
  params: { path: String },
  async handler(id, sftp) {
    return sftp.stat(this.path).then((stat) => jsonrpc.success(id, {
      mtime: stat.modifyTime,
      size: stat.size
    }))
  }
})

module.exports = method
