import Client from 'ssh2-sftp-client'
import { config } from './global-hooks'

export async function deleteSetup() {
  let client = new Client()
  await client.connect(config)
  await client.put(Buffer.alloc(0),`${config.remoteUrl}/delete-file`)
  await client.end()
}
