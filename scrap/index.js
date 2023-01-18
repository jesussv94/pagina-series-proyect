import * as cheerio from 'cheerio'
import fetch from 'cross-fetch'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const URLS = {
  // home: 'https://www.justwatch.com/es/series',
  home: 'https://www.justwatch.com/es/series?genres=msc&exclude_genres=spt&release_year_from=2023',
  baseUrl: 'https://www.justwatch.com'
}

async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

async function getHome () {
  const $ = await scrape(URLS.home)
  const $rows = $('div[class="title-list-grid__item"] a')

  let home = []

  $rows.each((index, el) => {
    const img = $(el).find('.title-poster picture img').attr('src')
    const tittle = $(el).find('.title-poster picture img').attr('alt')
    const url = $(el).attr('href')

    home.push({
      tittle,
      img,
      url
    })
  })
  return home
}

const home = await getHome()
const filePath = path.join(process.cwd(), './db/home.json')
await writeFile(filePath, JSON.stringify(home, null, 2), 'utf-8')

/*

async function getSerieDetails () {
  // const url = URLS.baseUr + meter funcion OnClick para sacar la url de la serie

  const url = 'https://www.justwatch.com/es/serie/wednesday'
  const $ = await scrape(url)
  const $rows = $('div[class="jw-info-box__container"]')

  let serieDetails = []
  $rows.each((index, el) => {
    const img = $(el).find('.title-poster picture > source:nth-child(1)').attr('data-srcset')
    const tittle = $(el).find('.title-block h1').text().trim()
    const synopsis = $(el).find('.jw-info-box__container-content > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > p:nth-child(1)').text()
    const gender = $(el).find('.title-info > div:nth-child(3) > div.detail-infos__value').text()
    const season = $(el).find('.hidden-horizontal-scrollbar__items .horizontal-title-list__item__caption').text()

    serieDetails.push({
      img,
      tittle,
      synopsis,
      gender,
      season
    })
  })
  return serieDetails
}

const serieDetails = await getSerieDetails()
const filePath = path.join(process.cwd(), './db/serieDetails.json')
await writeFile(filePath, JSON.stringify(serieDetails, null, 2), 'utf-8')

*/
