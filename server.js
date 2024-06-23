const express = require('express')
const dotenv = require('dotenv')
// const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express()

// init dotenv
dotenv.config()

// get environment variables
const PORT = process.env.PORT || 3003

const hostname = '127.0.0.1'

app.use('/', express.static(__dirname + '/dist'))
// Proxy requests to https://example.com/
// app.use('/api', createProxyMiddleware({ target: 'https://example.com', changeOrigin: true }));


app.listen(PORT, hostname, function () {
    console.log(`Server running at http://${hostname}:${PORT}/`)
})
