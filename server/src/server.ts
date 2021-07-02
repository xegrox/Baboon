import fastify from 'fastify'

const app = fastify()

app.post('/sftp_client', require('routes/sftp_client'))

app.listen(8000, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})

export default app
