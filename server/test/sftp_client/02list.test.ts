import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { config, newConnection } from './hooks/global-hooks'
import { listSetup, listCleanup } from './hooks/list-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND list', () => {

  before(async () => {
    await listSetup()
    sessionId = await newConnection()
  })

  after(listCleanup)

  it('When_MissingParams_Should_ReturnError_[-32602]InvalidParams', () => testRpcRequestParams('list', { path: String }))

  it('When_ValidPath_Should_ReturnSuccess_[Array<{mtime, name, type}>]FileInfoList', async () => {
    let payload = await sendRpcRequest('list', { path: config.remoteUrl }, sessionId)
    expect(payload).to.be.instanceof(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.be.instanceof(Array)
    let result = payload.result as Array<any>
    result.forEach((f) => {
      expect(f).to.have.property('mtime')
      expect(f).to.have.property('name')
      expect(f).to.have.property('type')
    })
    expect(result).to.contain.something.like({ name: 'list-file', type: '-' })
    expect(result).to.contain.something.like({ name: 'list-directory', type: 'd' })
  })

})
