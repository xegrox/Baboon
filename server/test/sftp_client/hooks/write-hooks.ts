import Client from 'ssh2-sftp-client'
import { config } from './global-hooks'

export async function writeCleanup() {
  let client = new Client()
  await client.connect(config)
  await client.delete(`${config.remoteUrl}/write-file`)
  await client.end()
}
