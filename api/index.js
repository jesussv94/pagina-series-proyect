import { Hono } from 'hono'
import home from '../db/series.json'
import SerieDetails from '../db/serieDetails.json'

const app = new Hono()

// Api
app.get('/', (ctx) => {
  return ctx.json([
    {
      endpoint: '/home',
      description: 'Returns home data'
    }
  ])
})

// Homepage
app.get('/home', (ctx) => {
  return ctx.json(home)
})

// Detalles
app.get('/details', (ctx) => {
  return ctx.json(SerieDetails)
})

// Redirección a detalles de cada serie al clicar en ella
app.get('/serie/:title', (ctx) => {
  const title = ctx.req.param('title')
  const foundTitle = SerieDetails.find((stats) => stats.title === title)

  return ctx.json(foundTitle)
})

app.get('/home/:title', (ctx) => {
  const title = ctx.req.param('title')
  const foundTitle = home.find((stats) => stats.title === title)

  return foundTitle ? ctx.json(foundTitle) : ctx.json({ message: 'Title not found' }, 404)
})

app.get('/details/:title', (ctx) => {
  const title = ctx.req.param('title')
  const foundTitle = SerieDetails.find((stats) => stats.title === title)

  return foundTitle ? ctx.json(foundTitle) : ctx.json({ message: 'Title not found' }, 404)
})

export default app

// npm run dev:api
// Open at http://localhost:8787/home
