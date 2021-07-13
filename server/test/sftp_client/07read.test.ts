import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { newConnection, config } from './hooks/global-hooks'
import { readSetup, readCleanup } from './hooks/read-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND read', () => {

  before(async () =>  {
    await readSetup()
    sessionId = await newConnection()
  })

  after(readCleanup)

  it('When_RequiredParamsPassed_Should_NotThrowError', () => testRpcRequestParams('read', { path: String }))

  it('When_ValidPath_Should_ReturnSuccess_[String]FileContents', async () => {
    let payload = await sendRpcRequest('read', { path: `${config.remoteUrl}/read-file` }, sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.equal('hello')
  })

})
