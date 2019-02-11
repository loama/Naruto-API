'use strict'

const express = require('express')
const app = express()

const cors = require('cors')

// FUNCTIONS IMPORTS
const helpers = require('./functions/helpers')

app
  .use(express.json())
  .use(cors())

  .get('/', (req, res) => index(req, res))

// V1
  .get('/v1', (req, res) => indexV1(req, res))

  // catch all routes, 404
  .all('*', (req, res) => notFound(req, res))

function index (req, res) {
  helpers.result(req, res, 200, 'success', 'welcome to Naruto API, you need to specify a version', {})
}

function indexV1 (req, res) {
  helpers.result(req, res, 200, 'success', 'welcome to Naruto API V1, try going to a path', {})
}

function notFound (req, res) {
  helpers.result(req, res, 404, 'error', 'route not found or incorrect HTTP method', {})
}

module.exports = app
