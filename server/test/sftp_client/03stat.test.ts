import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { newConnection, config } from './hooks/global-hooks'
import { statSetup, statCleanup } from './hooks/stat-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND stat', () => {

  before(async () =>  {
    await statSetup()
    sessionId = await newConnection()
  })

  after(statCleanup)

  it('When_RequiredParamsPassed_Should_NotThrowError', () => testRpcRequestParams('stat', { path: String }))

  it('When_ValidPath_Should_ReturnSuccess_[{mtime, size}]FileStats', async () => {
    let payload = await sendRpcRequest('stat', { path: `${config.remoteUrl}/stat-file` }, sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.have.property('mtime')
    expect(payload.result).to.have.property('size')
    let result = payload.result as { mtime: number, size: number}
    expect(result.mtime).to.be.a('number')
    expect(result.size).to.be.a('number')
  })

})
