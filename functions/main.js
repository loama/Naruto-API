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

  let testingCharacterNames = {
    'Tajima Uchiha': {
      title: 'Tajima Uchiha',
      href: '/wiki/Tajima_Uchiha',
      thumbnail: 'https://vignette.wikia.nocookie.net/naruto/images/2/26/Tajima_Uchiha.png/revision/latest/window-crop/width/40/x-offset/0/y-offset/31/window-width/819/window-height/614?cb=20140710125908'
    },
    'Takajō Torikai': {
      title: 'Takajō Torikai',
      href: '/wiki/Takaj%C5%8D_Torikai',
      thumbnail: 'https://vignette.wikia.nocookie.net/naruto/images/4/4e/Takajo_Torikai.png/revision/latest/window-crop/width/40/x-offset/0/y-offset/7/window-width/154/window-height/116?cb=20150807091226'
    },
    Takamaru: {
      title: 'Takamaru',
      href: '/wiki/Takamaru',
      thumbnail: 'https://vignette.wikia.nocookie.net/naruto/images/1/1e/Takamaru.png/revision/latest/window-crop/width/40/x-offset/0/y-offset/0/window-width/1429/window-height/1072?cb=20150731141252'
    },
    'Takanami Senka':
     { title: 'Takanami Senka',
       href: '/wiki/Takanami_Senka',
       thumbnail: 'https://vignette.wikia.nocookie.net/naruto/images/0/0e/Takanami.png/revision/latest/window-crop/width/40/x-offset/0/y-offset/0/window-width/1441/window-height/1080?cb=20181211061120' },
    Takishi:
     { title: 'Takishi',
       href: '/wiki/Takishi',
       thumbnail: 'https://vignette.wikia.nocookie.net/naruto/images/a/a8/Takishi.png/revision/latest/window-crop/width/40/x-offset/43/y-offset/0/window-width/1168/window-height/875?cb=20140206163004'
     },
    Taku:
     { title: 'Taku',
       href: '/wiki/Taku',
       thumbnail: 'https://vignette.wikia.nocookie.net/naruto/images/7/73/Taku.png/revision/latest/window-crop/width/40/x-offset/0/y-offset/14/window-width/328/window-height/246?cb=20120928102858'
     },
    Tamae:
     { title: 'Tamae',
       href: '/wiki/Tamae',
       thumbnail: 'https://vignette.wikia.nocookie.net/naruto/images/6/66/Tamae.png/revision/latest/window-crop/width/40/x-offset/0/y-offset/29/window-width/891/window-height/668?cb=20141110133710' },
    Tamaki:
     { title: 'Tamaki',
       href: '/wiki/Tamaki',
       thumbnail: 'https://vignette.wikia.nocookie.net/naruto/images/6/68/Tamaki.png/revision/latest/window-crop/width/40/x-offset/0/y-offset/26/window-width/836/window-height/627?cb=20170311140844' },
    Tamao:
     { title: 'Tamao',
       href: '/wiki/Tamao',
       thumbnail: 'https://vignette.wikia.nocookie.net/naruto/images/f/f7/Tamao.png/revision/latest/window-crop/width/40/x-offset/0/y-offset/0/window-width/1441/window-height/1080?cb=20161029000818' },
  }

  for (var key in testingCharacterNames) {
    let characterInfo = await characterDetails(testingCharacterNames[key])
    charactersComplete[key] = characterInfo
  }

  helpers.result(req, res, 200, 'success', 'data fetched', charactersComplete)
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

    return character
  } catch (error) {
    console.log(error)
    console.log(characterData.href)
  }
}
