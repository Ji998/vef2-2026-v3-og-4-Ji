import { api } from './client'
import type { Author } from './types'

export function getAuthors() {
  return api<Author[]>(`/authors`)
}