import Client from 'ssh2-sftp-client'
import { config } from './global-hooks'

export async function rmdirSetup() {
  let client = new Client()
  await client.connect(config)
  await client.mkdir(`${config.remoteUrl}/rmdir-directory/directory`, true)
  await client.end()
}
