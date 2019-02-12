const helpers = require('./helpers.js')

const rp = require('request-promise')
const $ = require('cheerio')
const url = 'https://naruto.fandom.com/wiki/Category:Characters'

exports.fetchData = function (req, res) {
  rp(url)
    .then(function (html) {
    // home html is fetched
      let alphabetShortcuts = $('ul[class=category-page__alphabet-shortcuts] > li[class=category-page__alphabet-shortcut]', html)

      let list = []
      alphabetShortcuts.find('a').each(function (index, element) {
        let text = $(element).text()
        if (text === 'Other') { // We want to save links, the link for 'other' in the webpage is '!'
          text = '!'
        }
        if (text !== '#') {
          list.push(text)
        }
      })

      // list now contains all the characters we should iterate into for fetching

      console.log(list)

      helpers.result(req, res, 200, 'success', 'data fetched', list)
    })
    .catch(function (err) {
      // handle error
      console.log(err)
    })
}
