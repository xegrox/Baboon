import {
  ID,
  SuccessObject,
  ErrorObject
} from 'jsonrpc-lite'
import Client from 'ssh2-sftp-client'

type ResponseObjects = SuccessObject | ErrorObject

interface MethodParams { [key: string]: any }

type MethodHandler = (id: ID, sftp?: Client) => ResponseObjects | Promise<ResponseObjects>

export default class Method<P extends MethodParams = MethodParams> {
  constructor(public opts: {
    params?: P,
    handler: MethodHandler
  } & ThisType<ExtractParamType<P>>) {}

  async exec(id: ID, params?: ExtractParamType<P>, sftp?: Client) {
    // Merge params into handler context
    return await ({...this.opts, ...(params ?? {})}).handler(id, sftp)
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
