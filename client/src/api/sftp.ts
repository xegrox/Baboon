import { App } from 'vue'
import Axios, { AxiosResponse, AxiosError } from 'axios'
import { accessor } from 'store/index'
import { AlertType } from 'types/AlertItem.interface'

const PATH = '/sftp_client'
const CONN_PATH = `${PATH}/connection`
const CMD_PATH = `${PATH}/commands`

// From ssh2-sftp-client src/constants.js
const ERROR_CODE = {
  generic: 'ERR_GENERIC_CLIENT',
  connect: 'ERR_NOT_CONNECTED',
  badPath: 'ERR_BAD_PATH',
  permission: 'EACCES',
  notexist: 'ENOENT',
  notdir: 'ENOTDIR'
}

interface SFTPError {
  msg: string,
  code: string
}

interface SFTPCred {
  host: string,
  port: number,
  username: string,
  password: string
}

interface PingInfo {
  hasClient: boolean,
  hasConnection: boolean
}

interface FileInfo {
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
  connect: (cred: SFTPCred) => new SFTPAction(`${CONN_PATH}/new`, cred),
  disconnect: () => new SFTPAction(`${CONN_PATH}/delete`, undefined),
  ping: () => new SFTPAction<PingInfo>(`${CONN_PATH}/ping`, undefined),
  list: (path: string) => new SFTPAction<FileInfo[]>(`${CMD_PATH}/list`, {path: path}),
  exists: (path: string) => new SFTPAction<false | FileInfoType>(`${CMD_PATH}/exists`, {path: path}),
  read: (path: string) => new SFTPAction<string>(`${CMD_PATH}/read`, {path: path}),
  write: (path: string, content: string) => new SFTPAction(`${CMD_PATH}/write`, {path: path, content: content}),
  mkdir: (path: string) => new SFTPAction(`${CMD_PATH}/mkdir`, {path: path}),
  delete: (path: string) => new SFTPAction(`${CMD_PATH}/delete`, {path: path}),
  rmdir: (path: string) => new SFTPAction(`${CMD_PATH}/rmdir`, {path: path})
}

export class SFTPAction<T = any> {
  private promise: Promise<AxiosResponse<any>>

  constructor(url: string, body: any) {
    this.promise = Axios.post<T>(url, body)
  }

  async exec<R>(_?: {onSuccess?: (data: T) => R, onError?: (msg: string) => R, onDone?: () => void}) {
    return this.promise.then((res) => {
      return _?.onSuccess?.(res.data)
    }).catch((e: AxiosError | Error) => {
      var msg: string
      if (Axios.isAxiosError(e)) {
        var data: SFTPError = e.response?.data
        msg = data.msg
        if (data.code ===  ERROR_CODE.connect) {
          accessor.sftp.setConnected(false)
          accessor.alerts.add({
            type: AlertType.Error,
            title: 'SFTP connection lost'
          })
          SFTPInstance.disconnect().exec()
          return undefined
        }
      }
      msg ??= e.message
      return _?.onError?.(msg)
    }).finally(_?.onDone)
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
