'use strict'

const test = require('tape')
const request = require('supertest')
const app = require('../server.js')

module.exports = {
  tests: function () {
    test('Correct index returned', function (t) {
      request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect('Access-Control-Allow-Origin', '*')
        .end(function (err, res) {
          let expectedIndex = {
            result: 'success',
            detail: 'welcome to Naruto API',
            data: {}
          }

          t.error(err, 'No error')
          t.same(res.body, expectedIndex, 'Index as expected')
          t.end()
        })
    })
  }
}
