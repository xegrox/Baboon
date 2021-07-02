import { Method } from '../interfaces'
import Client, { ConnectOptions } from 'ssh2-sftp-client'
import jsonrpc, { JsonRpcError } from 'jsonrpc-lite'
import store from 'store/clients'
import { v4 as uuidv4 } from 'uuid'
import { createHmac } from 'crypto'

const method: Method = {
  requiredParams: ['host', 'port', 'username', 'password'],
  async handler(payload) {
    const sftp = new Client()
    return sftp.connect(payload.params as ConnectOptions).then(() => {
      let key = process.env.SESSION_SECRET_KEY
      if (!key) return jsonrpc.error(payload.id, JsonRpcError.internalError('Env let SESSION_SECRET_KEY is not set'))
      let sessionId = uuidv4()
      let hashedId = createHmac('sha256', key).update(sessionId).digest('base64')
      store.set(hashedId, sftp)
      return jsonrpc.success(payload.id, hashedId)
    })
}}

export default method
