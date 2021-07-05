import Client from 'ssh2-sftp-client'
import { config } from './global-hooks'

export const dirPath = `${config.remoteUrl}/exists-directory`
export const filePath = `${config.remoteUrl}/exists-file`

export async function existsSetup() {
  let sftp = new Client()
  await sftp.connect(config)
  await sftp.mkdir(dirPath)
  await sftp.put(Buffer.from(''), filePath)
  await sftp.end()
}

export async function existsCleanup() {
  let sftp = new Client()
  await sftp.connect(config)
  await sftp.rmdir(dirPath)
  await sftp.delete(filePath)
  await sftp.end()
}
