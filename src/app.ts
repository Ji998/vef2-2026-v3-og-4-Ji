import { Hono } from 'hono'
import { authorsRouter } from './routes/authors.js'
import { articlesRouter } from './routes/articles.js'

export const app = new Hono()

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