import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { newConnection, config } from './hooks/global-hooks'
import { mkdirCleanup } from './hooks/mkdir-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND mkdir', () => {

  before(async () =>  {
    sessionId = await newConnection()
  })

  after(mkdirCleanup)

  it('When_MissingParams_Should_ReturnError_[-32602]InvalidParams', () => testRpcRequestParams('mkdir', { path: String}))

  it('When_ValidPath_Should_ReturnSuccess_[null]FolderCreatedRecursively', async () => {
    let payload = await sendRpcRequest('mkdir', { path: `${config.remoteUrl}/mkdir-directory/directory` }, sessionId)
    expect(payload).to.be.instanceOf(SuccessObject)
  })

})
