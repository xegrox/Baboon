import Client from 'ssh2-sftp-client'
import { config } from './global-hooks'

export async function statSetup() {
  let client = new Client()
  await client.connect(config)
  await client.put(Buffer.alloc(0),`${config.remoteUrl}/stat-file`)
  await client.end()
}

export async function statCleanup() {
  let client = new Client()
  await client.connect(config)
  await client.delete(`${config.remoteUrl}/stat-file`)
  await client.end()
}
