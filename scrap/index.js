import * as cheerio from 'cheerio'
import fetch from 'cross-fetch'
import { writeDBFile, SERIES, SERIEDETAILS } from '../db/index.js'

const response = await fetch('http://localhost:8787/details')
const serieBusqueda = await response.json()

async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

async function getSeries () {
// Join para incorporar a series la información de los géneros
  const getSeriesFrom = ({ titulo }) => {
    const title = SERIES.find(serie => serie.title === titulo)
    const gender = serieBusqueda.find(serie => serie.gender)
    return { title, gender }
  }
  console.log(getSeriesFrom())

  const url = 'https://www.justwatch.com/es/series/'
  const $ = await scrape(url)
  const $rows = $('div[class="title-list-grid__item"] a')

  let series = []

  $rows.each((index, el) => {
    const img = $(el).find('.title-poster picture img').attr('src')
    const title = $(el).find('.title-poster picture img').attr('alt')
    const url = $(el).attr('href')

    const details = getSeriesFrom({ titulo: title })

    series.push({
      title,
      img,
      url,
      details
    })

    console.log({
      title,
      details
    })
  })
  return series
}

const series = await getSeries()
await writeDBFile('series', series)
