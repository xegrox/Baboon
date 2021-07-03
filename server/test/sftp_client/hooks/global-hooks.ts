import { sendRpcRequest } from '../utils'
import { SuccessObject } from 'jsonrpc-lite'

export const config = {
  host: process.env.SFTP_HOST!,
  port: parseInt(process.env.SFTP_PORT!) ?? 22,
  username: process.env.SFTP_USERNAME!,
  password: process.env.SFTP_PASSWORD!,
  remoteUrl: process.env.SFTP_URL!
}

export const newConnection = async (): Promise<string> => {
  let payload = await sendRpcRequest('connect', config)
  if (!(payload instanceof SuccessObject)) throw Error('Unable to connect, invalid rpc payload received:\n' + JSON.stringify(payload))
  return payload.result as string
}
