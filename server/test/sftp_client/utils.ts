import server from 'server'
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'
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

// TODO: mock command handler and verify param has correct type
export const testRpcRequestParams = async (method: string, params: { [key: string]: () => any }) => {
  let promises = Array<Promise<void>>()
  let definedParams = Object.fromEntries(Object.entries(params).map(([k, v]) => [k, v()]))
  for (let p in definedParams) {
    promises.push(new Promise(async (resolve, reject) => {
      let payload = await sendRpcRequest(method, { ...definedParams, [p]: undefined })
      if (!(payload instanceof ErrorObject)) reject(Error(`Method passed without required param '${p}'`))
      else if (payload.error.code !== rpcErrorCode.params) {
        reject(Error(`Unexpected error with code '${payload.error.code}' received while testing method params`))
      }
      resolve()
    }))
  }
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
    // Ensure all sftp errors have data with properties code and message
    if (payload.error.code === rpcErrorCode.sftp) {
      expect(payload.error.data).to.exist
      expect(payload.error.data).to.have.property('code')
      expect(payload.error.data).to.have.property('message')
    }
  }
  return payload
}
