import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authorsRouter } from './routes/authors.js'
import { articlesRouter } from './routes/articles.js'

export const app = new Hono()

app.use(
  '*',
  cors({
    origin: ['http://localhost:5173'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
)


app.get('/', (c) => {
  return c.json({
    message: 'Vefforritun 2 2026 - verkefni 3 API',
    endpoints: {
      authors: '/authors',
      articles: '/articles',
    },
  })
})

app.route('/authors', authorsRouter)
app.route('/articles', articlesRouter)