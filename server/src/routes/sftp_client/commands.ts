import { Router } from 'express'
import Client from 'ssh2-sftp-client'
import store from 'store/sftp_clients'

declare global {
  namespace Express {
    interface Request {
      locals: {
        client: Client
      }
    }
  }
}

const router = Router()

router.use((req, res, next) => {
  if (store.has(req.sessionID)) {
    req.locals = {
      client: store.get(req.sessionID)
    }
    next()
  } else {
    res.status(401).send('No sftp object associated with session')
  }
})

router.post('/list', (req, res) => {
  req.locals.client.list(req.body.path).then((data) => {
    res.status(200).send(data.map((value) => {
      return {
        mtime: value.modifyTime,
        name: value.name,
        type: value.type
      }
    }).sort((a, b) => {
      var typeCmp = b.type.localeCompare(a.type)
      return typeCmp != 0 ? typeCmp : a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    }))
  }).catch((e: NodeJS.ErrnoException) => {
    res.status(400).send({
      msg: e.message,
      code: e.code
    })
  })
})

router.post('/exists', (req, res) => {
  req.locals.client.exists(req.body.path).then((data) => {
    res.status(200).send(data)
  }).catch((e: NodeJS.ErrnoException) => {
    res.status(400).send({
      msg: e.message,
      code: e.code
    })
  })
})

router.post('/read', (req, res) => {
  req.locals.client.get(req.body.path).then((data: Buffer) => {
    res.status(200).send(data.toString())
  }).catch((e: NodeJS.ErrnoException) => {
    res.status(400).send({
      msg: e.message,
      code: e.code
    })
  })
})

router.post('/write', (req, res) => {
  req.locals.client.put(Buffer.from(req.body.content), req.body.path).then(() => {
    res.sendStatus(200)
  }).catch((e: NodeJS.ErrnoException) => {
    res.status(400).send({
      msg: e.message,
      code: e.code
    })
  })
})

router.post('/mkdir', (req, res) => {
  req.locals.client.mkdir(req.body.path, true).then(() => {
    res.sendStatus(200)
  }).catch((e: NodeJS.ErrnoException) => {
    res.status(400).send({
      msg: e.message,
      code: e.code
    })
  })
})

router.post('/rmdir', (req, res) => {
  req.locals.client.rmdir(req.body.path, true).then(() => {
    res.sendStatus(200)
  }).catch((e: NodeJS.ErrnoException) => {
    res.status(400).send({
      msg: e.message,
      code: e.code
    })
  })
})

router.post('/delete', (req, res) => {
  req.locals.client.delete(req.body.path).then(() => {
    res.sendStatus(200)
  }).catch((e: NodeJS.ErrnoException) => {
    res.status(400).send({
      msg: e.message,
      code: e.code
    })
  })
})

module.exports = router
