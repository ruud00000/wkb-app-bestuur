const express = require('express')
// const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express()

const hostname = '127.0.0.1'
const port = 3003

app.use('/', express.static(__dirname + '/dist'))
// Proxy requests to https://fu2.computerhuys.nl/
// app.use('/api', createProxyMiddleware({ target: 'https://fu2.computerhuys.nl', changeOrigin: true }));


app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`)
})
