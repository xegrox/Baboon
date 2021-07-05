import { Method } from '../interfaces'
import { missingClientError } from '../errors'
import jsonrpc from 'jsonrpc-lite'

const method: Method = {
  requiredParams: ['path'],
  async handler(payload, sftp) {
    if (!sftp) return missingClientError(payload.id)
    return sftp.list((payload.params as any).path).then((list) => {
      return jsonrpc.success(payload.id, list.map((info) => {
        return {
          mtime: info.modifyTime,
          name: info.name,
          type: info.type
        }
      }))
    })
  }
}

module.exports = method
