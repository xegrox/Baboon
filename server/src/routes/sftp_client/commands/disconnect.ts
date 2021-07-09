import Method from '../method'
import jsonRpc from 'jsonrpc-lite'

const method = new Method({
  requireConnection: true,
  handler: (id, sftp) => sftp.end().then(() => jsonRpc.success(id, null))
})

module.exports = method
