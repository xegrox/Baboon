import jsonrpc, { ID, JsonRpcError } from 'jsonrpc-lite'

export const errorCodes = {
  generic: 'ERR_GENERIC_CLIENT',
  connect: 'ERR_NOT_CONNECTED',
  badPath: 'ERR_BAD_PATH',
  permission: 'EACCES',
  notexist: 'ENOENT',
  notdir: 'ENOTDIR',
  noclient: 'ERR_MISSING_CLIENT',
  unknown: 'ERR_UNKNOWN'
}

export const sftpRpcError = (id: ID, code: string, message: string) => jsonrpc.error(
  id,
  new JsonRpcError(
    'Sftp client error encountered while processing request',
    -32000,
    { code, message }
  )
)

export const unknownError = (id: ID, message: string) => sftpRpcError(
  id, 'ERR_UNKNOWN',
  'Unknown error encountered: ' + message
)

export const missingClientError = (id: ID) => sftpRpcError(
  id, errorCodes.noclient,
  'Unauthorized, no sftp connection object found'
)
