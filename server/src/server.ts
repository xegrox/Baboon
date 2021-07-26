import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import p from 'path'

const app = fastify()

app.post('/sftp_client', require('routes/sftp_client'))

app.register(fastifyStatic, {
  root: p.join(__dirname, '../../client/dist'),
  wildcard: false
})

app.get('*', (req, reply) => {
  reply.sendFile('index.html')
})


app.listen(8000, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})

export default app
