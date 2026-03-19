import type { Article } from '../api/types'
import ArticleCard from './ArticleCard'

type Props = {
  items: Article[]
}

export default function ArticleList({ items }: Props) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {items.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  )
}