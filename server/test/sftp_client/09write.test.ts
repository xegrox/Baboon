import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { newConnection, config } from './hooks/global-hooks'
import { writeCleanup } from './hooks/write-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND write', () => {

  before(async () =>  {
    sessionId = await newConnection()
  })

  after(writeCleanup)

  it('When_RequiredParamsPassed_Should_NotThrowError', () => testRpcRequestParams('write', { path: String, content: String }))

  it('When_ValidPath_Should_ReturnSuccess_[null]FileWritten', async () => {
    let payload = await sendRpcRequest('write', {
      path: `${config.remoteUrl}/write-file`,
      content: 'hello'
     }, sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
  })

})
