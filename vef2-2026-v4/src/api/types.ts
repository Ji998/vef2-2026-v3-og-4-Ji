export type Author = { id: number; name: string; email: string }

export type Article = {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  published: boolean
  authorId: number
  author?: Author
}

export type Paging = { limit: number; offset: number; total: number }
export type Paged<T> = { data: T[]; paging: Paging }