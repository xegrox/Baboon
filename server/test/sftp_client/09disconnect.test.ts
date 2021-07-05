import { expect } from 'chai'
import { sendRpcRequest, sftpErrorCode } from './utils'
import { newConnection } from './hooks/global-hooks'
import { SuccessObject, ErrorObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND disconnect', () => {

  before(async () =>  {
    sessionId = await newConnection()
  })

  it('When_HaveConnection_Should_ReturnSuccess_[void]Disconnected', async () => {
    let payload = await sendRpcRequest('disconnect', [], sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
  })

  it('When_NoConnection_Should_ReturnError_[-32000, ERR_NOT_CONNECTED]NotConnected', async () => {
    let payload = await sendRpcRequest('disconnect', [], sessionId)
    expect(payload).to.be.instanceOf(ErrorObject)
    payload = payload as ErrorObject
    let err = payload.error.data as NodeJS.ErrnoException
    expect(err.code, sftpErrorCode.connect)
  })

})
