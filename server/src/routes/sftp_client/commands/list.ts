import Method from '../method'
import jsonrpc from 'jsonrpc-lite'

const method = new Method({
  requireConnection: true,
  params: { path: String },
  async handler(id, sftp) {
    return sftp.list(this.path).then((list) => {
      return jsonrpc.success(id, list.map((info) => Object({
        mtime: info.modifyTime,
        name: info.name,
        type: info.type
      })))
    })
  }
})

module.exports = method
