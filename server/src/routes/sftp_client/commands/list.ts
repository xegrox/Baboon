import Method from '../method'
import { missingClientError } from '../errors'
import jsonrpc from 'jsonrpc-lite'

const method = new Method({
  params: { path: String },
  async handler(id, sftp) {
    if (!sftp) return missingClientError(id)
    return sftp.list(this.path).then((list) => {
      return jsonrpc.success(id, list.map((info) => {
        return {
          mtime: info.modifyTime,
          name: info.name,
          type: info.type
        }
      }))
    })
  }
})

module.exports = method
