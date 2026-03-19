import { Link } from 'react-router-dom'
import type { Article } from '../api/types'

type Props = {
  article: Article
}

export default function ArticleCard({ article }: Props) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <h3 style={{ margin: 0 }}>
        <Link to={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p style={{ margin: '8px 0' }}>{article.summary}</p>
      <small>author: {article.author?.name ?? article.authorId}</small>
    </div>
  )
}