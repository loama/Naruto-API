const db = require('../db')
const helpers = require('./helpers.js')

const rp = require('request-promise')
const $ = require('cheerio')

const baseUrl = 'https://naruto.fandom.com'
const mainPageUrl = baseUrl + '/wiki/Category:Characters'

exports.fetchData = async function (req, res) {
  let mainPage = await rp(mainPageUrl)

  let letters = fetchAlphabetLetters(mainPage)

  let charactersNames = await charactersList(letters)

  let charactersComplete = {}

  for (var key in charactersNames) {
    let characterInfo = await characterDetails(charactersNames[key])
    charactersComplete[key] = characterInfo
  }

  helpers.result(req, res, 200, 'success', 'data fetched', charactersComplete)
}

exports.getCharacters = function (req, res) {
  db.sequelize.query('SELECT id, title, href, thumbnail, description, toc, "createdAt", "updatedAt" FROM "Characters" ORDER BY id', {
    type: db.sequelize.QueryTypes.SELECT })
    .then(characters => {
      for (let i = 0; i < characters.length; i++) {
        characters[i]['toc'] = characters[i]['toc'].split(',')
      }
      helpers.result(req, res, 200, 'success', 'characters fetched', characters)
    }).catch(err => {
      console.log(err)
      helpers.result(req, res, 500, 'error', 'something went wrong', {})
    })
}

exports.getCharacter = function (req, res) {
  db.sequelize.query('SELECT * FROM "Characters" WHERE lower("title") = :title',
    { replacements:
      {
        title: decodeURIComponent(req.params.title.toLowerCase())
      },
    type: db.sequelize.QueryTypes.SELECT })
    .then(character => {
      character[0]['toc'] = character[0]['toc'].split(',')
      helpers.result(req, res, 200, 'success', 'character fetched', character[0])
    })
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
      if (charactersUL.children[j].name === 'li' && charactersUL.children[j].attribs.class === 'category-page__member') {
        let characterAnchor = $('a', charactersUL.children[j])['0']

        let characterImage = $('img', charactersUL.children[j])['0']
        let characterThumbnail
        if (characterImage !== undefined) {
          characterThumbnail = characterImage.attribs['data-src']
        } else {
          characterThumbnail = null
        }

        let character = {
          title: characterAnchor.attribs.title,
          href: characterAnchor.attribs.href,
          thumbnail: characterThumbnail
        }
        characters[characterAnchor.attribs.title] = character
      }
    }
  }
  return characters
}

async function characterDetails (characterData) {
  try {
    let characterPage = await rp(baseUrl + characterData.href)

    let content = $('#mw-content-text', characterPage)
    let htmlContent = content.html()

    let firstP = $('p', content).first()
    let description = {
      text: firstP.text(),
      html: firstP.html()
    }

    let toc = []
    content.find('h2').each(function (index, element) {
      let text = $(element).text()
      if (text !== 'Contents') {
        toc.push(text.replace(/ /g, ''))
      }
    })

    let mainImg
    if ($('a.image-thumbnail', content)['1'] !== undefined) {
      mainImg = $('a.image-thumbnail', content)['1'].attribs['href']
    } else {
      mainImg = null
    }

    let character = {
      title: characterData.title,
      href: characterData.href,
      thumbnail: characterData.thumbnail,
      description: description,
      toc: toc,
      htmlContent: htmlContent,
      mainImg: mainImg
    }

    let tocString = ''
    let endingChar
    for (var i = 0; i < toc.length; i++) {
      if (i < toc.length - 1) {
        endingChar = ','
      } else {
        endingChar = ''
      }
      tocString = tocString + toc[i] + endingChar
    }

    db.sequelize.query(`
      INSERT INTO "Characters" (title, href, thumbnail, description, toc, html_content, "createdAt", "updatedAt")
      VALUES (:title, :href, :thumbnail, :description, :toc, :html_content, :createdAt, :updatedAt)
      ON CONFLICT (title) DO UPDATE
      SET href = :href,
          thumbnail = :thumbnail,
          description = :description,
          toc = :toc,
          html_content = :html_content,
          "updatedAt" = :updatedAt;
      `,
    { replacements:
      {
        title: character.title,
        href: character.href,
        thumbnail: character.thumbnail,
        description: JSON.stringify(character.description),
        toc: tocString,
        html_content: character.htmlContent,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    type: db.sequelize.QueryTypes.INSERT })
      .then(person => {
        return character
      })
      .catch(err => {
        console.log(err)
        return 1
      })
    return character
  } catch (error) {
    console.log(error)
    console.log(characterData.href)
  }
}
