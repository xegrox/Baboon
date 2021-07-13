import { App } from 'vue'
import Axios from 'axios'
import { accessor } from 'store/index'
import { AlertType } from 'types/AlertItem.interface'
import jsonrpc, { JsonRpcError } from 'jsonrpc-lite'
import { v4 as uuidv4 } from 'uuid'

export enum rpcErrorCode {
  sftp = -32000,
  params = -32602
}

export enum sftpErrorCode {
  notfound = 'ENOTFOUND',
  connrefused = 'ECONNREFUSED',
  generic = 'ERR_GENERIC_CLIENT',
  connect = 'ERR_NOT_CONNECTED',
  badPath = 'ERR_BAD_PATH',
  permission = 'EACCES',
  notexist = 'ENOENT',
  notdir = 'ENOTDIR',
  nosession = 'ERR_MISSING_SESSION',
  unknown = 'ERR_UNKNOWN'
}

interface SFTPError {
  code: sftpErrorCode,
  message: string
}

export interface SFTPConfig {
  host: string,
  port: number,
  username: string,
  password: string
}

export enum Pong {
  nosession = -1,
  disconnected = 0,
  connected = 1,
}

export interface FileInfo {
  mtime: number,
  name: string,
  type: string
}

export enum FileInfoType {
  file = '-',
  dir = 'd',
  link = 'l'
}

const SFTPInstance = {
  connect: (cred: SFTPConfig) => sendRequest<string>('connect', cred),
  exists: (path: string) => sendRequest<false | FileInfoType>('exists', {path: path}),
  list: (path: string) => sendRequest<FileInfo[]>('list', {path: path}),
  mkdir: (path: string) => sendRequest('mkdir', {path: path}),
  rmdir: (path: string) => sendRequest('rmdir', {path: path}),
  read: (path: string) => sendRequest<string>('read', {path: path}),
  write: (path: string, content: string) => sendRequest('write', {path: path, content: content}),
  delete: (path: string) => sendRequest('delete', {path: path}),
  disconnect: () => sendRequest('delete'),
  ping: () => sendRequest<Pong>('ping')
}

const alert = (title: string, content?: string) => accessor.alerts.add({ type: AlertType.Error, title, content })

async function sendRequest<T extends any = null>(method: string, params?: object): Promise<T> {
  let req = jsonrpc.request(uuidv4(), method, params)
  let sessionId = accessor.sftp.sessionId
  let res = await Axios.post('/sftp_client', req, {
    headers: {
      'authorization': sessionId ? `Basic ${sessionId}` : undefined
    }
  })
  let parsed = jsonrpc.parseObject(res.data)
  switch(parsed.type) {
    case 'invalid':
      alert('An internal error occurred', 'Invalid rpc response:\m' + JSON.stringify(parsed.payload))
      throw parsed
    case 'error':
      handleError(parsed.payload.error)
      throw parsed
    case 'success':
      return parsed.payload.result as T
    default:
      alert('An internal error occurred', `Unexpected response of type '${parsed.payload.constructor}' received`)
      throw parsed
  }
}

function handleError(error: JsonRpcError) {
  if (error.code === rpcErrorCode.sftp) {
    let err: SFTPError = error.data
    switch(err.code) {
      case 'ENOTFOUND':
        alert('Host not found', err.message)
        break
      case 'ECONNREFUSED':
        alert('Connection refused', err.message)
        break
      case 'ERR_GENERIC_CLIENT':
        alert('Authentication failure', err.message) // Check
        break
      case 'ERR_NOT_CONNECTED':
        alert('Connection lost', err.message)
        break
      case 'ERR_BAD_PATH':
        alert('Invalid path', err.message)
        break
      case 'EACCES':
        alert('No permission', err.message)
        break
      case 'ENOENT':
        alert('Path does not exists', err.message)
        break
      case 'ENOTDIR':
        alert('Path is not a directory', err.message)
        break
      case 'ERR_MISSING_SESSION':
        alert('Not connected', err.message)
        break
      case 'ERR_UNKNOWN':
        alert('An internal error occurred', err.message)
    }
  } else {
    alert('An internal error occurred', `Code: ${error.code}:\n${error.message}\n${error.data}`)
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $sftp: typeof SFTPInstance
  }
}

export default {
  install: (app: App, _options?: any) => {
    app.config.globalProperties.$sftp = SFTPInstance
  }
}
