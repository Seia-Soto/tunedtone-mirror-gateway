const restify = require('restify')
const request = require('request')

const loadbalancing = require('./loadbalancing')

const config = require('./config')

const loadbalancer = new loadbalancing.models[config.loadbalancing.method](config.loadbalancing)
const server = restify.createServer({
  name: 'Tunedtone/mirror-gateway',
  dtrace: false
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.dateParser(59))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.jsonp())
server.use(restify.plugins.gzipResponse())

server.get('/*', (req, res) => {
  const requestLink = req.href()
  const server = loadbalancer.getServer()

  console.log('Main: Proxying request... HREF: ' + server.host + requestLink)

  request({
    url: server.host + requestLink,
    headers: {
      client: 'Tunedtone/Mirror-Gateway',
      key: config.verificationKey
    }
  }, (error, response, body) => {
    if (error) {
      console.error(error)

      res.status(500)
    } else {
      res.status(response.statusCode)
      res.sendRaw(body)
    }

    res.end()
  })
})

server.listen(config.hostPort, () => console.log('Listening from port %d', config.hostPort))
