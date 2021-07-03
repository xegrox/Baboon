import Client from 'ssh2-sftp-client'
import { config } from './global-hooks'

export async function listSetup() {
  let client = new Client()
  await client.connect(config)
  await client.mkdir(`${config.remoteUrl}/list-directory`)
  await client.put(Buffer.from(''), `${config.remoteUrl}/list-file`)
  await client.end()
}

export async function listCleanup() {
  let client = new Client()
  await client.connect(config)
  await client.rmdir(`${config.remoteUrl}/list-directory`)
  await client.delete(`${config.remoteUrl}/list-file`)
  await client.end()
}
