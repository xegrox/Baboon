import { Method } from '../interfaces'
import { missingClientError } from '../errors'
import jsonRpc from 'jsonrpc-lite'

const method: Method = {
  handler(payload, sftp) {
    if (!sftp) return missingClientError(payload.id)
    return sftp.end().then(() => jsonRpc.success(payload.id, null))
  }
}

export default method
