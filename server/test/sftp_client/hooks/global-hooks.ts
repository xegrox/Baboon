import { sendRpcRequest } from '../utils'
import { SuccessObject } from 'jsonrpc-lite'

export const sftpConfig = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT ?? 22,
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD
}

export const newConnection = async (): Promise<string> => {
  
  let payload = await sendRpcRequest('connect', sftpConfig)
  if (!(payload instanceof SuccessObject)) throw Error('Unable to connect, invalid rpc payload received:\n' + JSON.stringify(payload))
  return payload.result as string
}
