const EventEmitter = require('events')
const request = require('request')

class Events extends EventEmitter {}

module.exports = class Roundrobin {
  constructor(opts) {
    this.servers = (opts.mirrors || []).map(server => {
      server.activeCount = 0

      return server
    })
  }

  getServer() {
    const minActiveCount = Math.min(this.servers.map(server => {
      return server = server.activeCount
    }))
    const server = this.servers.find(server => server.activeCount === minActiveCount)

    server.activeCount += 1

    console.log(`loadbalancing/models/roundrobin: Updating server active counter... RETURN: ${server.host}#${server.activeCount}`)

    return server
  }
}
