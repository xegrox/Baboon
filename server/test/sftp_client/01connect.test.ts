import { expect } from 'chai'
import { sftpErrorCode, rpcErrorCode, sendRpcRequest, testRpcRequestParams } from './utils'
import { SuccessObject, ErrorObject } from 'jsonrpc-lite'

describe('COMMAND connect', () => {

  it('When_MissingParams_Should_ReturnError_[-32602]InvalidParams', () => testRpcRequestParams('connect', ['host', 'port', 'username', 'password']))

  it('When_ValidCredentials_Should_ReturnSuccess_[String]SessionID', async () => {
    let payload = await sendRpcRequest('connect', {
      host: 'localhost',
      port: 22,
      username: 'sftp_user',
      password: 'sftp22fed'
    })
    expect(payload).to.be.instanceOf(SuccessObject)
    payload = payload as SuccessObject
    expect(payload.result).to.be.a('string')
    expect(payload.result).to.have.length(44)
    let buffer = Buffer.from(payload.result as string, 'base64')
    expect(buffer.toString('hex')).to.have.length(64)
  })

  it('When_InvalidCredentials_Should_ReturnError_[-32000, ERR_GENERIC_CLIENT]ConnectionError', async () => {
    let payload = await sendRpcRequest('connect', {
      host: 'localhost',
      port: 22,
      username: 'sftp_user',
      password: 'invalid'
    })
    expect(payload).to.be.instanceOf(ErrorObject)
    payload = payload as ErrorObject
    expect(payload.error.code).to.equal(rpcErrorCode.sftp)
    let err = payload.error.data as NodeJS.ErrnoException
    expect(err.code).to.equal(sftpErrorCode.generic)
  })
})
