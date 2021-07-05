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

  it('Should fail with missing params', () => testRpcRequestParams('exists', ['path']))

  it('Should return filetype when dir exists', async () => {
    let payload = await sendRpcRequest('exists', { path: dirPath }, sessionId)
    expect(payload).to.be.instanceof(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.be.a('string')
    expect(payload.result).to.equal('d')
  })

  it('Should return filetype when file exists', async () => {
    let payload = await sendRpcRequest('exists', { path: filePath }, sessionId)
    expect(payload).to.be.instanceof(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.be.a('string')
    expect(payload.result).to.equal('-')
  })

  it('Should return false when path not exists', async () => {
    let payload = await sendRpcRequest('exists', { path: `${config.remoteUrl}/not-exists-path`}, sessionId)
    expect(payload).to.be.instanceof(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.be.a('boolean')
    expect(payload.result).to.equal(false)
  })

})
