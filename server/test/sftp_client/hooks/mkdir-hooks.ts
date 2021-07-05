import Client from 'ssh2-sftp-client'
import { config } from './global-hooks'

export async function mkdirCleanup() {
  let client = new Client()
  await client.connect(config)
  await client.rmdir(`${config.remoteUrl}/mkdir-directory`, true)
  await client.end()
}
