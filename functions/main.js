const helpers = require('./helpers.js')

const rp = require('request-promise')
const $ = require('cheerio')
const mainPageUrl = 'https://naruto.fandom.com/wiki/Category:Characters'

exports.fetchData = async function (req, res) {
  let mainPage = await rp(mainPageUrl)

  let letters = fetchAlphabetLetters(mainPage)

  let characters = await charactersList(letters)

  helpers.result(req, res, 200, 'success', 'data fetched', characters)
}

function fetchAlphabetLetters (html) {
  let alphabetShortcuts = $('ul[class=category-page__alphabet-shortcuts] > li[class=category-page__alphabet-shortcut]', html)

  let letterList = []
  alphabetShortcuts.find('a').each(function (index, element) {
    let text = $(element).text()
    if (text === 'Other') { // We want to save links, the link for 'other' in the webpage is '!'
      text = '¡'
    }
    if (text !== '#') {
      letterList.push(text)
    }
  })
  return letterList
}

async function charactersList (letterList) {
  let characters = {}

  for (let i = 0; i < letterList.length; i++) {
    let letterPage = await rp(mainPageUrl + '?from=' + letterList[i])

    let charactersUL = $('ul[class=category-page__members-for-char]', letterPage)['0']
    for (let j = 0; j < charactersUL.children.length; j++) {
      // console.log(charactersUL.children[j])
      if (charactersUL.children[j].name === 'li' && charactersUL.children[j].attribs.class === 'category-page__member') {
        let characterAnchor = $('a', charactersUL.children[j])['0']
        console.log('--------------')
        console.log(characterAnchor.attribs)
        let character = {
          title: characterAnchor.attribs.title,
          href: characterAnchor.attribs.href
        }
        characters[characterAnchor.attribs.title] = character
      }
    }
    console.log(i)
  }
  console.log(characters)
  return characters
}
