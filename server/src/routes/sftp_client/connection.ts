import Client from 'ssh2-sftp-client'
import * as utils from 'ssh2-sftp-client/src/utils'
import { Router } from 'express'
import store from 'store/sftp_clients'

const router = Router()

function haveConnection(client: Client): boolean {
  if (!client) return false
  return utils.haveConnection(client, 'sftp', () => {})
}

router.post('/new', (req, res) => {
  var sftp_user = req.body
  let sftp = new Client();
  sftp.connect(sftp_user).then(() => {
    console.log(`Connected to ${sftp_user.host}:${sftp_user.port}`)
    store.set(req.sessionID, sftp)
    res.sendStatus(200)
  }).catch((e: NodeJS.ErrnoException) => {
    res.status(400).send({
      code: e.code,
      msg: e.message
    })
  });
})

router.post('/delete', (req, res) => {
  var client = store.get(req.sessionID)
  if (haveConnection(client)) client.end()
  store.delete(req.sessionID) ? res.sendStatus(200) : res.sendStatus(404)
})

router.post('/ping', (req, res) => {
  var client = store.get(req.sessionID)
  res.status(200).send({
    hasClient: client != undefined,
    hasConnection: haveConnection(client)
  })
})

module.exports = router
