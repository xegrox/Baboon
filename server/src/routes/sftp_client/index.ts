import store from 'store/clients'
import jsonrpc, { RequestObject, JsonRpcError } from 'jsonrpc-lite'
import { FastifyRequest, FastifyReply } from 'fastify'
import { errorCodes, unknownError, sftpRpcError } from './errors'
import { Method } from './interfaces'

const methods: {
  [key: string]: Method
} = {
  connect: require('./commands/connect'),
  list: require('./commands/list'),
  exists: require('./commands/exists'),
  mkdir: require('./commands/mkdir'),
  disconnect: require('./commands/disconnect')
}

module.exports = async (req: FastifyRequest, res: FastifyReply) => {
  let payload = jsonrpc.parseObject(req.body).payload
  if (payload instanceof RequestObject) {
    let method = methods[payload.method]

    // Check method exists
    if (!method) {
      res.send(jsonrpc.error(payload.id, JsonRpcError.methodNotFound(`Method '${payload.method}' does not exists`)))
      return
    }

    // Check param exists
    for (let param of method.requiredParams ?? []) {
      if (!payload.params?.[param]) {
        let err = JsonRpcError.invalidParams(`Missing param '${param}'`)
        res.send(jsonrpc.error(payload.id, err))
        return
      }
    }

    // Parse header authorization string
    let token = req.headers.authorization
    const tokenType = 'Basic '
    if (token && token.startsWith(tokenType)) token = token.substring(tokenType.length, token.length)
    try {
      res.send(await method.handler(
        payload,
        token ? store.get(token) : undefined
      ))
    } catch (e) {
      let err: NodeJS.ErrnoException = (e instanceof Error) ? e : Error(e)
      err.message ??= 'No message provided'
      res.send(
        err.code && Object.values(errorCodes).indexOf(err.code) > -1
        ? sftpRpcError(payload.id, err.code, err.message)
        : unknownError(payload.id, err.message)
      )
    }
  }
}
