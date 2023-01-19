import { Hono } from 'hono'
import home from '../db/home.json'

const app = new Hono()

app.get('/', (ctx) => {
  return ctx.json([
    {
      endpoint: '/home',
      description: 'Returns home data'
    }
  ])
})

app.get('/home', (ctx) => {
  return ctx.json(home)
})

export default app

// npm run dev:api
// Open at http://localhost:8787/home
