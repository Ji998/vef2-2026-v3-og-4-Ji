import { useEffect, useState } from 'react'
import { getAuthors } from '../api/authors'
import { createArticle } from '../api/articles'
import type { Author } from '../api/types'
import { ApiError } from '../api/client'
import ErrorMessage from '../components/ErrorMessage'

export default function CreateArticel() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [authorId, setAuthorId] = useState<number>(0)

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(true)

  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')

  useEffect(() => {
    async function run() {
      setErr('')
      try {
        const a = await getAuthors()
        setAuthors(a)
        setAuthorId(a[0]?.id ?? 0)
      } catch (e) {
        setErr(e instanceof ApiError ? `Error ${e.status}: ${e.message}` : 'Unknown error')
      }
    }
    void run()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setOk('')
    try {
      const created = await createArticle({ title, summary, content, authorId, published })
      setOk(`Created slug: ${created.slug}`)
      setTitle('')
      setSummary('')
      setContent('')
    } catch (e2) {
      setErr(e2 instanceof ApiError ? `Error ${e2.status}: ${e2.message}` : 'Unknown error')
    }
  }

  return (
    <div>
      <h1>Create</h1>
      <ErrorMessage message={err} />
      {ok && <p>{ok}</p>}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 600 }}>
        <label>
          title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label>
          summary
          <input value={summary} onChange={(e) => setSummary(e.target.value)} required />
        </label>

        <label>
          text
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} required />
        </label>

        <label>
          author
          <select value={authorId} onChange={(e) => setAuthorId(Number(e.target.value))} required>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} (#{a.id})
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          published
        </label>

        <button type="submit" disabled={!authorId}>
          create
        </button>
      </form>
    </div>
  )
}