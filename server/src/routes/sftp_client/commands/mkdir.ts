import Method from '../method'
import { missingClientError } from '../errors'
import jsonrpc from 'jsonrpc-lite'

const method = new Method({
  params: { path: String },
  handler(id, sftp) {
    if (!sftp) return missingClientError(id)
    return sftp.mkdir(this.path, true).then(() => jsonrpc.success(id, null))
  }
})

module.exports = method
