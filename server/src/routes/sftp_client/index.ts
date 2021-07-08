import store from 'store/clients'
import jsonrpc, { RequestObject, JsonRpcError, Defined } from 'jsonrpc-lite'
import { FastifyRequest, FastifyReply } from 'fastify'
import { errorCodes, unknownError, sftpRpcError } from './errors'
import Method from './method'

const methods: {
  [key: string]: Method
} = {
  connect: require('./commands/connect'),
  list: require('./commands/list'),
  exists: require('./commands/exists'),
  mkdir: require('./commands/mkdir'),
  rmdir: require('./commands/rmdir'),
  disconnect: require('./commands/disconnect')
}

module.exports = async (req: FastifyRequest, res: FastifyReply) => {
  let payload = jsonrpc.parseObject(req.body).payload
  if (payload instanceof RequestObject) {
    let method = methods[payload.method]

    // Ensure method exists
    if (!method) {
      res.send(jsonrpc.error(payload.id, JsonRpcError.methodNotFound(`Method '${payload.method}' does not exists`)))
      return
    }

    // Ensure params are in object format
    let parsedParams: { [key: string]: any } | Defined[] | undefined = payload.params
    if (parsedParams instanceof Array) {
      res.send(jsonrpc.error(payload.id, JsonRpcError.invalidParams('Params must be an object')))
      return
    }

    // Validate required params
    let requiredPTypes = method.opts.params
    for (let requiredPName in requiredPTypes) {
      let parsedPValue = parsedParams?.[requiredPName]
      let requiredPType = requiredPTypes[requiredPName]

      // Check if required param exists
      if (parsedPValue === undefined) {
        res.send(jsonrpc.error(payload.id, JsonRpcError.invalidParams(`Missing param '${requiredPName}'`)))
        return
      }

      // Check param has required type
      if (typeof parsedPValue !== typeof requiredPType()) {
        let err = JsonRpcError.invalidParams(`Param '${requiredPName}' must be of type ${typeof requiredPType()}`)
        res.send(jsonrpc.error(payload.id, err))
        return
      }
    }

    // Parse req authorization header containing sessionId
    let sessionId = req.headers.authorization
    const tokenType = 'Basic '
    if (sessionId && sessionId.startsWith(tokenType)) sessionId = sessionId.substring(tokenType.length, sessionId.length)
    try {
      res.send(await method.exec(
        payload.id,
        parsedParams,
        sessionId ? store.get(sessionId) : undefined
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
