import { App } from 'vue'
import Axios, { AxiosResponse, AxiosError } from 'axios'
import { accessor } from '../store/index'
import { AlertType } from '../types/AlertItem.interface'

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
  exists: (path: string) => new SFTPAction<false | FileInfoType>(`${CMD_PATH}/exists`, {path: path})
}

class SFTPAction<T = any> {
  private promise: Promise<AxiosResponse<any>>

  constructor(url: string, body: any) {
    this.promise = Axios.post<T>(url, body)
  }

  exec(_?: {onSuccess?: (data: T) => void, onError?: (msg: string) => void}) {
    this.promise.then((res) => {
      _?.onSuccess?.(res.data)
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
        }
      }
      msg ??= e.message
      _?.onError?.(msg)
    })
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
