import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getArticleBySlug } from '../api/articles'
import type { Article } from '../api/types'
import { ApiError } from '../api/client'

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    async function run() {
      if (!slug) return
      setErr('')
      try {
        setArticle(await getArticleBySlug(slug))
      } catch (e) {
        setErr(e instanceof ApiError ? `Error ${e.status}: ${e.message}` : 'Unknown error')
      }
    }
    void run()
  }, [slug])

  return (
    <div>
      <Link to="/">{'< Back'}</Link>
      {err && <p>{err}</p>}
      {article && (
        <>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
          <small>Author: {article.author?.name ?? article.authorId}</small>
          <hr />
          <p style={{ whiteSpace: 'pre-wrap' }}>{article.content}</p>
        </>
      )}
    </div>
  )
}