import express from 'express'

const router = express.Router()
router.use('/connection', require('./connection'))
router.use('/commands', require('./commands'))

module.exports = router
