import Method from '../method'
import { missingClientError  } from '../errors'
import jsonrpc from 'jsonrpc-lite'

const method = new Method({
  params: { path: String },
  async handler(id, sftp) {
    if (!sftp) return missingClientError(id)
    return sftp.exists(this.path).then((exists) => {
      return jsonrpc.success(id, exists)
    })
  }
})

module.exports = method
