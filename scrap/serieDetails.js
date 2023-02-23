import * as cheerio from 'cheerio'
import fetch from 'cross-fetch'
import { SERIES, writeDBFile } from '../db/index.js'

const baseUrl = 'https://www.justwatch.com'

async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

async function getSerieDetails () {
  let serieDetails = []

  for (const serie of SERIES) {
    const { url, title } = serie
    const urlDetails = `${baseUrl}${url}`

    const $ = await scrape(urlDetails)
    const $rows = $('div[class="jw-info-box__container"]')

    $rows.each((index, el) => {
      const img = $(el).find('.title-poster picture > source:nth-child(1)').attr('data-srcset')
      const title = $(el).find('.title-block h1').text().trim()
      const synopsis = $(el).find('.jw-info-box__container-content > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > p > span').text()
      const gender = $(el).find('.title-info > div:nth-child(3) > div.detail-infos__value').text().trim()
      const season = $(el).find('.hidden-horizontal-scrollbar__items .horizontal-title-list__item__caption').text().trim()

      serieDetails.push({
        img,
        title,
        synopsis,
        gender,
        season
      })
    })
  }
  return serieDetails
}

const serieDetails = await getSerieDetails()
await writeDBFile('serieDetails', serieDetails)
