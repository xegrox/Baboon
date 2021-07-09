import server from 'server'
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'
import sinon from 'sinon'
import Method from 'routes/sftp_client/method'
import jsonrpc, {
  SuccessObject,
  NotificationObject,
  RequestObject,
  ErrorObject,
  JsonRpcError
} from 'jsonrpc-lite'

export const rpcErrorCode = {
  sftp: -32000,
  params: -32602
}

// Error codes attached with rpc error -32000 (sftp)
export const sftpErrorCode = {
  generic: 'ERR_GENERIC_CLIENT',
  connect: 'ERR_NOT_CONNECTED',
  badPath: 'ERR_BAD_PATH',
  permission: 'EACCES',
  notexist: 'ENOENT',
  notdir: 'ENOTDIR',
  noclient: 'ERR_MISSING_CLIENT',
  unknown: 'ERR_UNKNOWN'
}

export const testRpcRequestParams = async (method: string, params: { [key: string]: () => any }) => {
  let promises = Array<Promise<void>>()
  let definedParams = Object.fromEntries(Object.entries(params).map(([k, v]) => [k, v()]))
  sinon.stub(Method.prototype, 'exec').callsFake(async (id) => jsonrpc.success(id, null))

  // Ensure method calls when all params are passed
  let payload = await sendRpcRequest(method, definedParams)
  if (payload instanceof ErrorObject) {
    // Throw error for any missing params or wrong type
    throw Error(`${payload.error.message}: ${payload.error.data}`)
  }

  // Ensure method fails if any params are missing
  for (let p in definedParams) {
    promises.push(new Promise(async (resolve, reject) => {
      let payload = await sendRpcRequest(method, { ...definedParams, [p]: undefined })
      if (!(payload instanceof ErrorObject)) reject(Error(`Param '${p}' is not required: Method passed without the param`))
      resolve()
    }))
  }

  sinon.restore()
  return Promise.all(promises)
}

export async function sendRpcRequest(method: string, params?: object, sessionId?: string)
  : Promise<SuccessObject | NotificationObject | RequestObject | ErrorObject> {
  let res = await server.inject({
    method: 'POST',
    url: '/sftp_client',
    headers: { authorization: sessionId ? 'Basic ' + sessionId : '' },
    payload: jsonrpc.request(uuidv4(), method, params)
  })

  let parsed = jsonrpc.parseJsonRpcString(res.body)
  if (parsed instanceof Array) throw Error('Obtained multiple response objects')
  let payload = parsed.payload

  if (payload instanceof JsonRpcError) throw Error(`Invalid rpc format: ${JSON.stringify(res.body)}`)
  if (payload instanceof ErrorObject) {
    // Ensure all sftp errors contain data with properties code and message
    if (payload.error.code === rpcErrorCode.sftp) {
      expect(payload.error.data).to.exist
      expect(payload.error.data).to.have.property('code')
      expect(payload.error.data).to.have.property('message')
    }
  }
  return payload
}
