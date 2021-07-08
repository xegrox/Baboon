import Method from '../method'
import { missingClientError } from '../errors'
import jsonRpc from 'jsonrpc-lite'

const method = new Method({
  handler(id, sftp) {
    if (!sftp) return missingClientError(id)
    return sftp.end().then(() => jsonRpc.success(id, null))
  }
})

module.exports = method
