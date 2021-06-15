import { Router } from 'express'

const router = Router()

router.use('/sftp_client', require('./sftp_client'))

module.exports = router
