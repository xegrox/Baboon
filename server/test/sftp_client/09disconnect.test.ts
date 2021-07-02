import { expect } from 'chai'
import { sendRpcRequest, sftpErrorCode } from './utils'
import { newConnection } from './hooks/global-hooks'
import { SuccessObject, ErrorObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND disconnect', () => {

  before(async () =>  {
    sessionId = await newConnection()
  })

  it('Should succeed with existing connection', async () => {
    let payload = await sendRpcRequest('disconnect', [], sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
  })

  it('Should fail with no connection', async () => {
    let payload = await sendRpcRequest('disconnect', [], sessionId)
    expect(payload).to.be.instanceOf(ErrorObject)
    payload = payload as ErrorObject
    let err = payload.error.data as NodeJS.ErrnoException
    expect(err.code, sftpErrorCode.connect)
  })

})
