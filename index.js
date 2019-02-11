'use strict'

const PORT = process.env.PORT || 8888
const HOST = process.env.HOST || 'localhost'

const server = require('./server.js')
// MODULE IMPORTS
const throng = require('throng')

const WORKERS = process.env.WEB_CONCURRENCY || 1

function start () {
  server
    .listen(PORT, () => console.log(`Listening on PORT: ${PORT}, open http://${HOST}:${PORT} to preview it`))
}

// Heroku in-dyno cluster configuration
throng({
  workers: WORKERS,
  lifetime: Infinity,
  start: start
})
