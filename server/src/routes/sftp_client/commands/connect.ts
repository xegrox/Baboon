import Method from '../method'
import Client from 'ssh2-sftp-client'
import jsonrpc, { JsonRpcError } from 'jsonrpc-lite'
import store from 'store/clients'
import { v4 as uuidv4 } from 'uuid'
import { createHmac } from 'crypto'

const method = new Method({
  params: {
    host: String,
    port: Number,
    username: String,
    password: String
  },
  async handler(id) {
    const sftp = new Client()
    return sftp.connect(this).then(() => {
      let key = process.env.SESSION_SECRET_KEY
      if (!key) return jsonrpc.error(id, JsonRpcError.internalError('Env SESSION_SECRET_KEY is not set'))
      let sessionId = uuidv4()
      let hashedId = createHmac('sha256', key).update(sessionId).digest('base64')
      store.set(hashedId, sftp)
      return jsonrpc.success(id, hashedId)
    })
  }
})

module.exports = method
