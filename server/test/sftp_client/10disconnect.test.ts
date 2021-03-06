import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { newConnection } from './hooks/global-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND disconnect', () => {

  before(async () =>  {
    sessionId = await newConnection()
  })

  it('When_RequiredParamsPassed_Should_NotThrowError', () => testRpcRequestParams('disconnect', {}))

  it('When_HaveConnection_Should_ReturnSuccess_[null]Disconnected', async () => {
    let payload = await sendRpcRequest('disconnect', undefined, sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
  })

})
