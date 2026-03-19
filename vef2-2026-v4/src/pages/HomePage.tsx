import { useEffect, useState } from 'react'
import { getArticles } from '../api/articles'
import { ApiError } from '../api/client'
import type { Article, Paged } from '../api/types'

import ErrorMessage from '../components/ErrorMessage'
import ArticleList from '../components/ArticleList'
import Pagination from '../components/Pagination'

export default function HomePage() {
  const limit = 10

  const [offset, setOffset] = useState(0)
  const [data, setData] = useState<Paged<Article> | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    async function run() {
      setErr('')
      try {
        const res = await getArticles(limit, offset)
        setData(res)
      } catch (e) {
        if (e instanceof ApiError) setErr(`Error ${e.status}: ${e.message}`)
        else if (e instanceof Error) setErr(e.message)
        else setErr('Unknown error')
      }
    }

    void run()
  }, [limit, offset])

  const total = data?.paging.total ?? 0

  return (
    <div>
      <h1>News</h1>

      <ErrorMessage message={err} />

      <ArticleList items={data?.data ?? []} />

      <Pagination
        offset={offset}
        limit={limit}
        total={total}
        onPrev={() => setOffset((o) => Math.max(0, o - limit))}
        onNext={() => setOffset((o) => o + limit)}
      />
    </div>
  )
}