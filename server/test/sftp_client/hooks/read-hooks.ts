import Client from 'ssh2-sftp-client'
import { config } from './global-hooks'

export async function readSetup() {
  let client = new Client()
  await client.connect(config)
  await client.put(Buffer.from('hello', 'utf8'),`${config.remoteUrl}/read-file`)
  await client.end()
}

export async function readCleanup() {
  let client = new Client()
  await client.connect(config)
  await client.delete(`${config.remoteUrl}/read-file`)
  await client.end()
}
