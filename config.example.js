module.exports = {
  hostPort: 3697,
  verificationKey: 'tunedtone',
  loadbalancing: {
    method: 'roundrobin',
    mirrors: [
      {
        host: 'http://localhost:3597'
      }
    ]
  }
}
