import {
  RequestObject,
  SuccessObject,
  ErrorObject
} from 'jsonrpc-lite'
import Client from 'ssh2-sftp-client'

type ResponseObjects = SuccessObject | ErrorObject

export interface Method {
  requiredParams?: Array<string>,
  handler: (payload: RequestObject, connection?: Client) => Promise<ResponseObjects> | ResponseObjects,
}
