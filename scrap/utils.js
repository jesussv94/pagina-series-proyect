import { SERIES } from '../db/index.js'

export async function getURLSeries ($) {
  return SERIES.map((serie) => {
    return `https://www.justwatch.com${serie.url}/`
  })
}
