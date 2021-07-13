import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { newConnection, config } from './hooks/global-hooks'
import { deleteSetup } from './hooks/delete-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND delete', () => {

  before(async () =>  {
    await deleteSetup()
    sessionId = await newConnection()
  })

  it('When_RequiredParamsPassed_Should_NotThrowError', () => testRpcRequestParams('delete', { path: String }))

  it('When_ValidPath_Should_ReturnSuccess_[null]FileDeleted', async () => {
    let payload = await sendRpcRequest('delete', { path: `${config.remoteUrl}/delete-file` }, sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
  })

})
