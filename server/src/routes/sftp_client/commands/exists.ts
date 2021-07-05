import { Method } from '../interfaces'
import { missingClientError  } from '../errors'
import jsonrpc from 'jsonrpc-lite'

const method: Method = {
  requiredParams: ['path'],
  async handler(payload, sftp) {
    if (!sftp) return missingClientError(payload.id)
    return sftp.exists((payload.params as any).path).then((exists) => {
      return jsonrpc.success(payload.id, exists)
    })
  }
}

module.exports = method
