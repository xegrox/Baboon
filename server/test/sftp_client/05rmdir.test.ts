import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { newConnection, config } from './hooks/global-hooks'
import { rmdirSetup } from './hooks/rmdir-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND rmdir', () => {

  before(async () =>  {
    sessionId = await newConnection()
    rmdirSetup()
  })

  it('When_MissingParams_Should_ReturnError_[-32602]InvalidParams', () => testRpcRequestParams('rmdir', { path: String }))

  it('When_ValidPath_Should_ReturnSuccess_[null]FolderRemovedRecursively', async () => {
    let payload = await sendRpcRequest('rmdir', { path: `${config.remoteUrl}/rmdir-directory` }, sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
  })

})
