import {
  ID,
  SuccessObject,
  ErrorObject
} from 'jsonrpc-lite'
import Client from 'ssh2-sftp-client'
import { missingSessionError } from './errors'

type ResponseObjects = SuccessObject | ErrorObject

interface MethodParams { [key: string]: any }

type MethodReturn = ResponseObjects | Promise<ResponseObjects>


export default class Method<P extends MethodParams = MethodParams> {
  constructor(public opts: ({
    params?: P,
    requireConnection?: false
    handler(id: ID): MethodReturn,
  } | {
    params?: P,
    requireConnection: true,
    handler(id: ID, sftp: Client): MethodReturn
  }) & ThisType<ExtractParamType<P>>) {}

  async exec(id: ID, params?: ExtractParamType<P>, sftp?: Client): Promise<ResponseObjects> {
    if (!this.opts.requireConnection) {
      return this.opts.handler.call(params, id)
    } else {
      if (!sftp) return missingSessionError(id)
      return this.opts.handler.call(params, id, sftp)
    }
  }
}

// Determine param type from its constructor
type ExtractParamType<P extends MethodParams> = { [K in keyof P]: InferParamType<P[K]> }

type InferParamType<T> = T extends ObjectConstructor
      ? Record<string, any>
      : T extends BooleanConstructor
        ? boolean
        : T extends NumberConstructor
        ? number
        : T extends StringConstructor
          ? string
          : unknown
