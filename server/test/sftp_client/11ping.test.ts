import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { newConnection } from './hooks/global-hooks'
import { SuccessObject } from 'jsonrpc-lite'
import store from 'store/clients'

let sessionId: string

describe('COMMAND ping', () => {

  before(async () =>  {
    sessionId = await newConnection()
  })

  it('When_RequiredParamsPassed_Should_NotThrowError', () => testRpcRequestParams('ping', {}))

  it('When_HaveConnection_Should_ReturnSuccess_[Number](1)Connected', async () => {
    let payload = await sendRpcRequest('ping', undefined, sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.equal(1)
  })

  it('When_NoConnection_Should_ReturnSuccess_[Number](0)Disconnected', async () => {
    store.get(sessionId)!.end()
    let payload = await sendRpcRequest('ping', undefined, sessionId)
    payload = payload as SuccessObject
    expect(payload.result).to.equal(1)
  })

  it('When_NoSession_Should_ReturnSuccess_[Number](-1)NoSession', async () => {
    store.delete(sessionId)
    let payload = await sendRpcRequest('ping', undefined, sessionId)
    payload = payload as SuccessObject
    expect(payload.result).to.equal(-1)
  })
})
