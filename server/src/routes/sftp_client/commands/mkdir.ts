import { Method } from '../interfaces'
import { missingClientError } from '../errors'
import jsonrpc from 'jsonrpc-lite'

const method: Method = {
  requiredParams: ['path'],
  handler(payload, sftp) {
    if (!sftp) return missingClientError(payload.id)
    return sftp.mkdir((payload.params as any).path, true).then(() => jsonrpc.success(payload.id, null))
  }
}

module.exports = method
