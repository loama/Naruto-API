const helpers = require('./helpers.js')

const rp = require('request-promise')
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States'

exports.fetchData = function (req, res) {
  rp(url)
    .then(function (html) {
      // success!
      console.log(html)
      helpers.result(req, res, 200, 'success', 'data fetched', html)
    })
    .catch(function (err) {
      // handle error
      console.log(err)
    })
}
