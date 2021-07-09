import { expect } from 'chai'
import { testRpcRequestParams, sendRpcRequest } from './utils'
import { config, newConnection } from './hooks/global-hooks'
import { existsSetup, existsCleanup, dirPath, filePath } from './hooks/exists-hooks'
import { SuccessObject } from 'jsonrpc-lite'

let sessionId: string

describe('COMMAND exists', () => {

  before(async () => {
    await existsSetup()
    sessionId = await newConnection()
  })

  after(existsCleanup)

  it('When_RequiredParamsPassed_Should_NotThrowError', () => testRpcRequestParams('exists', { path: String }))

  it('When_DirExists_Should_ReturnSuccess-[String](\'d\')FileType', async () => {
    let payload = await sendRpcRequest('exists', { path: dirPath }, sessionId)
    expect(payload).to.be.instanceof(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.be.a('string')
    expect(payload.result).to.equal('d')
  })

  it('When_FileExists_Should_ReturnSuccess_[String](\'-\')FileType', async () => {
    let payload = await sendRpcRequest('exists', { path: filePath }, sessionId)
    expect(payload).to.be.instanceof(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.be.a('string')
    expect(payload.result).to.equal('-')
  })

  it('When_PathNotExists_Should_ReturnSuccess_[Bool](false)FileNotExists', async () => {
    let payload = await sendRpcRequest('exists', { path: `${config.remoteUrl}/not-exists-path`}, sessionId)
    expect(payload).to.be.instanceof(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.be.a('boolean')
    expect(payload.result).to.equal(false)
  })

})
