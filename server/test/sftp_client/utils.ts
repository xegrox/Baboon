import server from 'server'
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'
import jsonrpc, {
  SuccessObject,
  NotificationObject,
  RequestObject,
  ErrorObject,
  JsonRpcError,
  RpcParams
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

export const testRpcRequestParams= async (method: string, params: Array<string>) => {
  let paramsObj = params.reduce((acc,curr)=> (acc[curr]='',acc),{})
  return Promise.all(params.map((p) => async () => {
    let payload = await sendRpcRequest(method, { ...paramsObj, [p]: undefined })
    expect(payload).to.be.instanceof(ErrorObject)
    payload = payload as ErrorObject
    expect(payload.error.code).to.equal(rpcErrorCode.params)
  }))
}

export async function sendRpcRequest(method: string, params: RpcParams, sessionId?: string)
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
  if (payload instanceof JsonRpcError) throw Error(`Invalid rpc format: ${JSON.stringify(payload)}`)
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
