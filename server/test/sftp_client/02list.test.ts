import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { newConnection } from './hooks/global-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND list', () => {

  before(async () => {
    sessionId = await newConnection()
  })

  it('Should fail with missing params', () => testRpcRequestParams('list', ['path']))

  it('Should succeed with valid path', async () => {
    let payload = await sendRpcRequest('list', { path: '/' }, sessionId)
    expect(payload).to.be.instanceof(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.be.instanceof(Array)
    let result = payload.result as Array<Object>
    expect(result[0]).to.have.property('mtime')
    expect(result[0]).to.have.property('name')
    expect(result[0]).to.have.property('type')
  })

})
