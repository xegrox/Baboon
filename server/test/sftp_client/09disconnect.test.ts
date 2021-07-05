import { expect } from 'chai'
import { sendRpcRequest } from './utils'
import { newConnection } from './hooks/global-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND disconnect', () => {

  before(async () =>  {
    sessionId = await newConnection()
  })

  it('When_HaveConnection_Should_ReturnSuccess_[null]Disconnected', async () => {
    let payload = await sendRpcRequest('disconnect', [], sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
  })

})
