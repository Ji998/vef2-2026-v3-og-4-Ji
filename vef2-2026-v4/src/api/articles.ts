import { api } from './client'
import type { Article, Paged } from './types'

export function getArticles(limit: number, offset: number) {
  return api<Paged<Article>>(`/articles?limit=${limit}&offset=${offset}`)
}

export function getArticleBySlug(slug: string) {
  return api<Article>(`/articles/${encodeURIComponent(slug)}`)
}

export type CreateArticleInput = {
  title: string
  summary: string
  content: string
  authorId: number
  published: boolean
}

export function createArticle(input: CreateArticleInput) {
  return api<Article>(`/articles`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}